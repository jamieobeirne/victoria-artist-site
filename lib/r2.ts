import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { NodeHttpHandler } from '@smithy/node-http-handler'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

let _client: S3Client | undefined

function client(): S3Client {
  // Built once and reused: a fresh S3Client per call gets its own connection pool,
  // so keep-alive never applies and every request pays a new TLS handshake.
  // Still lazy, so env vars are not read at import time.
  return (_client ??= new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID ?? '',
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? '',
    },
    // Without these, a dropped connection hangs indefinitely — requestTimeout
    // defaults to 0, meaning no timeout — and the render dies with a blank
    // TimeoutError carrying no message. maxAttempts counts the initial call,
    // so 2 means one call plus one retry.
    maxAttempts: 2,
    requestHandler: new NodeHttpHandler({
      connectionTimeout: 3_000,
      requestTimeout: 8_000,
    }),
  }))
}

export async function getObject(key: string): Promise<string> {
  const res = await client().send(new GetObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: key }))
  const body = await res.Body?.transformToString()
  if (body === undefined) throw new Error(`R2 object "${key}" has no body`)
  return body
}

export async function getObjectWithMeta(key: string): Promise<{ body: string; etag?: string }> {
  const res = await client().send(new GetObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: key }))
  const body = await res.Body?.transformToString()
  if (body === undefined) throw new Error(`R2 object "${key}" has no body`)
  return { body, etag: res.ETag }
}

export async function putObject(
  key: string,
  body: string,
  contentType = 'application/json',
  ifMatch?: string
): Promise<void> {
  await client().send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: contentType,
      ...(ifMatch ? { IfMatch: ifMatch } : {}),
    })
  )
}

export async function deleteObject(key: string): Promise<void> {
  await client().send(new DeleteObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: key }))
}

export async function presignUpload(key: string, contentType: string, expiresInSeconds = 300): Promise<string> {
  const cmd = new PutObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: key, ContentType: contentType })
  return getSignedUrl(client(), cmd, { expiresIn: expiresInSeconds })
}

export function publicUrlFor(key: string): string {
  return `${process.env.R2_PUBLIC_BASE_URL}/${key}`
}

export function keyFromPublicUrl(url: string): string {
  const base = process.env.R2_PUBLIC_BASE_URL
  if (base && url.startsWith(`${base}/`)) {
    return url.slice(base.length + 1)
  }
  return url.replace(/^https?:\/\/[^/]+\//, '')
}
