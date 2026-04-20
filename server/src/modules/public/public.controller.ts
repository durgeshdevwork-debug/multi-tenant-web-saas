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

export const getLanding = async (req: Request, res: Response) => {
  try {
    const tenantId = getTenant(req)._id;
    const content = await PublicService.getLanding(tenantId);
    sendSuccess(res, content);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

export const getAbout = async (req: Request, res: Response) => {
  try {
    const tenantId = getTenant(req)._id;
    const content = await PublicService.getAbout(tenantId);
    sendSuccess(res, content);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

export const getContact = async (req: Request, res: Response) => {
  try {
    const tenantId = getTenant(req)._id;
    const content = await PublicService.getContact(tenantId);
    sendSuccess(res, content);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

export const getServices = async (req: Request, res: Response) => {
  try {
    const tenantId = getTenant(req)._id;
    const services = await PublicService.getServices(tenantId);
    sendSuccess(res, services);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

export const getBlogList = async (req: Request, res: Response) => {
  try {
    const tenantId = getTenant(req)._id;
    const posts = await PublicService.getBlogList(tenantId);
    sendSuccess(res, posts);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

export const getBlogPost = async (req: Request, res: Response) => {
  try {
    const tenantId = getTenant(req)._id;
    const post = await PublicService.getBlogPost(tenantId, req.params.slug as string);
    
    if (!post) return sendError(res, 'Post not found', 404);
    
    sendSuccess(res, post);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};
