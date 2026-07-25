import { manifestSchema, type Manifest } from './schema'
import { getObject, putObject } from './r2'

const MANIFEST_KEY = 'manifest.json'

export async function readManifest(): Promise<Manifest> {
  const raw = await getObject(MANIFEST_KEY)

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

export async function writeManifest(next: Manifest): Promise<void> {
  const result = manifestSchema.safeParse(next)
  if (!result.success) {
    throw new Error(`Refusing to write invalid manifest: ${result.error.message}`)
  }
  await putObject(MANIFEST_KEY, JSON.stringify(result.data, null, 2))
}
