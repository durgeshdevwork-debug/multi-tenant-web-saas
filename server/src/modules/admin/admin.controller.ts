import { Request, Response } from 'express';
import { AdminService } from './admin.service';
import { sendSuccess, sendError } from '../../shared/utils/response';

export const listTemplates = async (req: Request, res: Response) => {
  try {
    const templates = await AdminService.listTemplates();
    sendSuccess(res, templates);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

export const seedTemplate = async (req: Request, res: Response) => {
  try {
    const template = await AdminService.seedTemplate(req.body);
    sendSuccess(res, template, 'Template created', 201);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

export const createClient = async (req: Request, res: Response) => {
  try {
    const result = await AdminService.createClient(req.body);
    // Returning apiKey at the top layer
    res.status(201).json({ success: true, data: { tenant: result.tenant, user: result.user }, apiKey: result.apiKey });
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
};

export const listClients = async (req: Request, res: Response) => {
  try {
    const tenants = await AdminService.listClients();
    sendSuccess(res, tenants);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

export const getClient = async (req: Request, res: Response) => {
  try {
    const tenant = await AdminService.getClient(req.params.id as string);
    sendSuccess(res, tenant);
  } catch (error: any) {
    sendError(res, error.message, 404);
  }
};

export const updateClient = async (req: Request, res: Response) => {
  try {
    const tenant = await AdminService.updateClient(req.params.id as string, req.body);
    sendSuccess(res, tenant);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

export const regenerateApiKey = async (req: Request, res: Response) => {
  try {
    const result = await AdminService.regenerateApiKey(req.params.id as string);
    res.json({ success: true, data: result.tenant, apiKey: result.apiKey });
  } catch (error: any) {
    sendError(res, error.message, 404);
  }
};
