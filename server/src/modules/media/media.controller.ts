import type { Request, Response } from 'express';
import { sendError, sendSuccess } from '@shared/utils/response';
import { MediaService } from './media.service';

function getTenantId(req: Request) {
  return (req as any).user?.tenantId as string | undefined;
}

function getUploadedBy(req: Request) {
  return (req as any).user?.email as string | undefined;
}

export const listMedia = async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    if (!tenantId) {
      return sendError(res, 'Tenant access required', 400);
    }

    const media = await MediaService.listMedia(tenantId);
    sendSuccess(res, media);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

export const uploadMedia = async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const file = (req as any).file as Express.Multer.File | undefined;
    if (!tenantId) {
      return sendError(res, 'Tenant access required', 400);
    }
    if (!file) {
      return sendError(res, 'No file uploaded', 400);
    }

    const media = await MediaService.uploadMedia({
      tenantId,
      file,
      uploadedBy: getUploadedBy(req),
      altText: typeof req.body?.altText === 'string' ? req.body.altText : undefined
    });

    sendSuccess(res, media, 'Media uploaded', 201);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

export const deleteMedia = async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    if (!tenantId) {
      return sendError(res, 'Tenant access required', 400);
    }

    const media = await MediaService.deleteMedia(tenantId, req.params.id as string);
    if (!media) {
      return sendError(res, 'Not found', 404);
    }

    sendSuccess(res, { message: 'Deleted successfully' });
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

