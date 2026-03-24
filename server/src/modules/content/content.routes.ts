import { Router } from 'express';
import { requireTenantUser } from '../../shared/middlewares/roleMiddleware';
import * as contentController from './content.controller';

export const contentRouter = Router();

// Protect all content routes (requires an active session and a valid tenantId OR admin role)
contentRouter.use(requireTenantUser);

// Landing
contentRouter.get('/landing', contentController.getLandingContent);
contentRouter.put('/landing', contentController.updateLandingContent);

// About
contentRouter.get('/about', contentController.getAboutContent);
contentRouter.put('/about', contentController.updateAboutContent);

// Contact
contentRouter.get('/contact', contentController.getContactContent);
contentRouter.put('/contact', contentController.updateContactContent);

// Services
contentRouter.get('/services', contentController.listServices);
contentRouter.post('/services', contentController.createService);
contentRouter.put('/services/:id', contentController.updateService);
contentRouter.delete('/services/:id', contentController.deleteService);

// Blog
contentRouter.get('/blog', contentController.listBlogPosts);
contentRouter.post('/blog', contentController.createBlogPost);
contentRouter.put('/blog/:id', contentController.updateBlogPost);
contentRouter.delete('/blog/:id', contentController.deleteBlogPost);
