import { Request, Response } from 'express';
import { PublicService } from './public.service';
import { sendSuccess, sendError } from '../../shared/utils/response';

const getTenant = (req: Request) => (req as any).tenant;

export const getSiteDetails = async (req: Request, res: Response) => {
  try {
    const tenant = getTenant(req);
    const details = await PublicService.getSiteDetails(tenant);
    sendSuccess(res, details);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

export const getLayout = async (req: Request, res: Response) => {
  try {
    const tenant = getTenant(req);
    const layout = await PublicService.getLayout(tenant);
    sendSuccess(res, layout);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

export const listPages = async (req: Request, res: Response) => {
  try {
    const pages = await PublicService.getPages(String(getTenant(req)._id));
    sendSuccess(res, pages);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

export const getPageByPath = async (req: Request, res: Response) => {
  try {
    const path = ((req.query.path as string | undefined) ?? '/').trim() || '/';
    const page = await PublicService.getPageByPath(String(getTenant(req)._id), path);

    if (!page) return sendError(res, 'Page not found', 404);

    sendSuccess(res, page);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};
