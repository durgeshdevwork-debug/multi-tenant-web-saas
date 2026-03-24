import { Request, Response } from 'express';
import { ContentService } from './content.service';
import { sendSuccess, sendError } from '../../shared/utils/response';

const getTenantId = (req: Request) => (req as any).user?.tenantId;

// Singletons
export const getLandingContent = async (req: Request, res: Response) => {
  try {
    const content = await ContentService.getLanding(getTenantId(req));
    sendSuccess(res, content);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

export const updateLandingContent = async (req: Request, res: Response) => {
  try {
    const content = await ContentService.updateLanding(getTenantId(req), req.body);
    sendSuccess(res, content);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

export const getAboutContent = async (req: Request, res: Response) => {
  try {
    const content = await ContentService.getAbout(getTenantId(req));
    sendSuccess(res, content);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

export const updateAboutContent = async (req: Request, res: Response) => {
  try {
    const content = await ContentService.updateAbout(getTenantId(req), req.body);
    sendSuccess(res, content);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

export const getContactContent = async (req: Request, res: Response) => {
  try {
    const content = await ContentService.getContact(getTenantId(req));
    sendSuccess(res, content);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

export const updateContactContent = async (req: Request, res: Response) => {
  try {
    const content = await ContentService.updateContact(getTenantId(req), req.body);
    sendSuccess(res, content);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

// Services
export const listServices = async (req: Request, res: Response) => {
  try {
    const services = await ContentService.listServices(getTenantId(req));
    sendSuccess(res, services);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

export const createService = async (req: Request, res: Response) => {
  try {
    const service = await ContentService.createService(getTenantId(req), req.body);
    res.status(201).json({ success: true, data: service });
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

export const updateService = async (req: Request, res: Response) => {
  try {
    const service = await ContentService.updateService(getTenantId(req), req.params.id as string, req.body);
    if (!service) return sendError(res, 'Not found', 404);
    sendSuccess(res, service);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

export const deleteService = async (req: Request, res: Response) => {
  try {
    const service = await ContentService.deleteService(getTenantId(req), req.params.id as string);
    if (!service) return sendError(res, 'Not found', 404);
    sendSuccess(res, { message: 'Deleted successfully' });
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

// Blog
export const listBlogPosts = async (req: Request, res: Response) => {
  try {
    const posts = await ContentService.listBlogPosts(getTenantId(req));
    sendSuccess(res, posts);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

export const createBlogPost = async (req: Request, res: Response) => {
  try {
    const post = await ContentService.createBlogPost(getTenantId(req), req.body);
    res.status(201).json({ success: true, data: post });
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

export const updateBlogPost = async (req: Request, res: Response) => {
  try {
    const post = await ContentService.updateBlogPost(getTenantId(req), req.params.id as string, req.body);
    if (!post) return sendError(res, 'Not found', 404);
    sendSuccess(res, post);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

export const deleteBlogPost = async (req: Request, res: Response) => {
  try {
    const post = await ContentService.deleteBlogPost(getTenantId(req), req.params.id as string);
    if (!post) return sendError(res, 'Not found', 404);
    sendSuccess(res, { message: 'Deleted successfully' });
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};
