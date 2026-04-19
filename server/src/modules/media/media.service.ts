import { MediaAsset } from './models/MediaAsset';
import { buildMediaKey, uploadBufferToS3 } from '@shared/utils/s3';

export class MediaService {
  static async listMedia(tenantId: string) {
    return await MediaAsset.find({ tenantId }).sort({ createdAt: -1 });
  }

  static async uploadMedia(params: {
    tenantId: string;
    file: Express.Multer.File;
    uploadedBy?: string;
    altText?: string;
  }) {
    const key = buildMediaKey(params.tenantId, params.file.originalname);
    const url = await uploadBufferToS3({
      key,
      body: params.file.buffer,
      contentType: params.file.mimetype,
      contentLength: params.file.size
    });

    return await MediaAsset.create({
      tenantId: params.tenantId,
      key,
      url,
      originalName: params.file.originalname,
      mimeType: params.file.mimetype,
      size: params.file.size,
      uploadedBy: params.uploadedBy,
      altText: params.altText
    });
  }

  static async deleteMedia(tenantId: string, id: string) {
    const asset = await MediaAsset.findOneAndDelete({ _id: id, tenantId });
    return asset;
  }
}
