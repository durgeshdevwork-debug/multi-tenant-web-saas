import { Router } from 'express';
import { requireApiKey } from '../../shared/middlewares/apiKeyMiddleware';
import * as publicController from './public.controller';

export const publicRouter = Router();

// We mount with /:apiKey so all routes under it have the apiKey param.
// E.g., /api/public/:apiKey/site
const tenantScopedRouter = Router({ mergeParams: true });

tenantScopedRouter.use(requireApiKey);

tenantScopedRouter.get('/site', publicController.getSiteDetails);
tenantScopedRouter.get('/layout', publicController.getLayout);
tenantScopedRouter.get('/landing', publicController.getLanding);
tenantScopedRouter.get('/about', publicController.getAbout);
tenantScopedRouter.get('/contact', publicController.getContact);
tenantScopedRouter.get('/services', publicController.getServices);
tenantScopedRouter.get('/blog', publicController.getBlogList);
tenantScopedRouter.get('/blog/:slug', publicController.getBlogPost);

// Mount the scoped router onto the main public router
publicRouter.use('/:apiKey', tenantScopedRouter);
