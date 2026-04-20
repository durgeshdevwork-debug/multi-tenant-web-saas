import { Request, Response } from 'express';
import { ContentService } from './content.service';
import { sendSuccess, sendError } from '../../shared/utils/response';

const getTenantId = (req: Request) => (req as any).user?.tenantId;

export const listPages = async (req: Request, res: Response) => {
  try {
    const pages = await ContentService.listPages(getTenantId(req));
    sendSuccess(res, pages);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

export const listPageTree = async (req: Request, res: Response) => {
  try {
    const pages = await ContentService.listPageTree(getTenantId(req));
    sendSuccess(res, pages);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

export const getPage = async (req: Request, res: Response) => {
  try {
    const page = await ContentService.getPage(getTenantId(req), req.params.id as string);
    if (!page) return sendError(res, 'Page not found', 404);
    sendSuccess(res, page);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

export const createPage = async (req: Request, res: Response) => {
  try {
    const page = await ContentService.createPage(getTenantId(req), req.body);
    res.status(201).json({ success: true, data: page });
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

export const updatePage = async (req: Request, res: Response) => {
  try {
    const page = await ContentService.updatePage(getTenantId(req), req.params.id as string, req.body);
    if (!page) return sendError(res, 'Page not found', 404);
    sendSuccess(res, page);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

export const deletePage = async (req: Request, res: Response) => {
  try {
    const result = await ContentService.deletePage(getTenantId(req), req.params.id as string);
    sendSuccess(res, result);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

export const getSiteSettings = async (req: Request, res: Response) => {
  try {
    const settings = await ContentService.getSiteSettings(getTenantId(req));
    sendSuccess(res, settings);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

export const updateSiteSettings = async (req: Request, res: Response) => {
  try {
    const settings = await ContentService.updateSiteSettings(getTenantId(req), req.body);
    sendSuccess(res, settings);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};
