import { manifestSchema, type Manifest } from './schema'
import { getObject, getObjectWithMeta, putObject } from './r2'

const MANIFEST_KEY = 'manifest.json'

export class ManifestConflictError extends Error {
  constructor() {
    super('Manifest was changed by someone else since it was last read. Reload and try again.')
    this.name = 'ManifestConflictError'
  }
}

function parseManifest(raw: string): Manifest {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error('Manifest is corrupted: failed to parse JSON. Aborting rather than treating it as empty.')
  }

  const result = manifestSchema.safeParse(parsed)
  if (!result.success) {
    throw new Error(`Manifest failed schema validation: ${result.error.message}`)
  }
  return result.data
}

function isPreconditionFailed(err: unknown): boolean {
  const e = err as { name?: string; $metadata?: { httpStatusCode?: number } } | undefined
  return e?.name === 'PreconditionFailed' || e?.$metadata?.httpStatusCode === 412
}

export async function readManifest(): Promise<Manifest> {
  const raw = await getObject(MANIFEST_KEY)
  return parseManifest(raw)
}

/** Like readManifest, but also returns the object's ETag so a subsequent write can be made conditional on nothing having changed in between (see writeManifest). */
export async function readManifestForUpdate(): Promise<{ manifest: Manifest; etag?: string }> {
  const { body, etag } = await getObjectWithMeta(MANIFEST_KEY)
  return { manifest: parseManifest(body), etag }
}

/**
 * Writes the manifest. When `expectedEtag` is provided, the write is conditional
 * (R2 If-Match) and throws ManifestConflictError if the object changed since it
 * was read — callers doing read-modify-write (create/update/delete) must pass
 * the etag from readManifestForUpdate() to avoid silently clobbering a
 * concurrent admin's edit.
 */
export async function writeManifest(next: Manifest, expectedEtag?: string): Promise<void> {
  const result = manifestSchema.safeParse(next)
  if (!result.success) {
    throw new Error(`Refusing to write invalid manifest: ${result.error.message}`)
  }
  try {
    await putObject(MANIFEST_KEY, JSON.stringify(result.data, null, 2), 'application/json', expectedEtag)
  } catch (err) {
    if (isPreconditionFailed(err)) throw new ManifestConflictError()
    throw err
  }
}
