import { Request, Response } from 'express';
import { sendError, sendSuccess } from '../../shared/utils/response';
import { TestimonialService } from './testimonials.service';

const getTenantId = (req: Request) => (req as any).user?.tenantId;

export const listCollections = async (req: Request, res: Response) => {
  try {
    const collections = await TestimonialService.listCollections(getTenantId(req));
    sendSuccess(res, collections);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

export const listTestimonials = async (req: Request, res: Response) => {
  try {
    const testimonials = await TestimonialService.listTestimonials(
      getTenantId(req),
      (req.query.collectionId as string | undefined) || undefined
    );
    sendSuccess(res, testimonials);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

export const getTestimonial = async (req: Request, res: Response) => {
  try {
    const testimonial = await TestimonialService.getTestimonial(getTenantId(req), req.params.id as string);
    if (!testimonial) return sendError(res, 'Testimonial not found', 404);
    sendSuccess(res, testimonial);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

export const createTestimonial = async (req: Request, res: Response) => {
  try {
    const testimonial = await TestimonialService.createTestimonial(getTenantId(req), req.body);
    sendSuccess(res, testimonial, 'Testimonial created', 201);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
};

export const updateTestimonial = async (req: Request, res: Response) => {
  try {
    const testimonial = await TestimonialService.updateTestimonial(getTenantId(req), req.params.id as string, req.body);
    if (!testimonial) return sendError(res, 'Testimonial not found', 404);
    sendSuccess(res, testimonial);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
};

export const deleteTestimonial = async (req: Request, res: Response) => {
  try {
    const result = await TestimonialService.deleteTestimonial(getTenantId(req), req.params.id as string);
    if (!result) return sendError(res, 'Testimonial not found', 404);
    sendSuccess(res, result);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
};
