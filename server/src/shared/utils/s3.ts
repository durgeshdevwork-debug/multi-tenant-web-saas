import { randomUUID } from "crypto";
import path from "path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { env } from "@configs/env";

let client: S3Client | null = null;

function getS3Client() {
  if (client) return client;

  const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = env;
  if (!AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
    throw new Error("AWS S3 credentials are not configured");
  }

  client = new S3Client({
    region: AWS_REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
  });

  return client;
}

export function buildMediaKey(tenantId: string, originalName: string) {
  const safeName = originalName
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const extension = path.extname(safeName) || "";
  const baseName = path.basename(safeName, extension) || "asset";
  return `tenants/${tenantId}/media/${Date.now()}-${randomUUID()}-${baseName}${extension}`;
}

export function getPublicMediaUrl(key: string) {
  if (env.AWS_S3_PUBLIC_BASE_URL) {
    return `${env.AWS_S3_PUBLIC_BASE_URL.replace(/\/$/, "")}/${key}`;
  }

  if (!env.AWS_S3_BUCKET_NAME || !env.AWS_REGION) {
    throw new Error("AWS S3 bucket configuration is missing");
  }

  return `https://${env.AWS_S3_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;
}

export async function uploadBufferToS3(input: {
  key: string;
  body: Buffer;
  contentType: string;
  contentLength?: number;
}) {
  if (!env.AWS_S3_BUCKET_NAME) {
    throw new Error("AWS_S3_BUCKET_NAME is required");
  }

  const command = new PutObjectCommand({
    Bucket: env.AWS_S3_BUCKET_NAME,
    Key: input.key,
    Body: input.body,
    ContentType: input.contentType,
    ContentLength: input.contentLength,
    // ACL: 'public-read'
  });

  await getS3Client().send(command);
  return getPublicMediaUrl(input.key);
}
