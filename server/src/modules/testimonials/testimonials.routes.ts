import { Router } from 'express';
import { requireTenantUser } from '../../shared/middlewares/roleMiddleware';
import * as testimonialsController from './testimonials.controller';

export const testimonialsRouter = Router();

testimonialsRouter.use(requireTenantUser);

testimonialsRouter.get('/collections', testimonialsController.listCollections);
testimonialsRouter.get('/', testimonialsController.listTestimonials);
testimonialsRouter.post('/', testimonialsController.createTestimonial);
testimonialsRouter.get('/:id', testimonialsController.getTestimonial);
testimonialsRouter.put('/:id', testimonialsController.updateTestimonial);
testimonialsRouter.delete('/:id', testimonialsController.deleteTestimonial);
