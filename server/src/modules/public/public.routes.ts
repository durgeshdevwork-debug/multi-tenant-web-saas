import { Router } from 'express';
import { requireApiKey } from '../../shared/middlewares/apiKeyMiddleware';
import * as publicController from './public.controller';

export const publicRouter = Router();

const tenantScopedRouter = Router({ mergeParams: true });

tenantScopedRouter.use(requireApiKey);

tenantScopedRouter.get('/site', publicController.getSiteDetails);
tenantScopedRouter.get('/layout', publicController.getLayout);
tenantScopedRouter.get('/pages', publicController.listPages);
tenantScopedRouter.get('/page', publicController.getPageByPath);

publicRouter.use('/:apiKey', tenantScopedRouter);
