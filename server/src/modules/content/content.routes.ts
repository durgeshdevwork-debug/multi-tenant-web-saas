import { Router } from 'express';
import { requireTenantUser } from '../../shared/middlewares/roleMiddleware';
import * as contentController from './content.controller';
import { mediaRouter } from '@modules/media/media.routes';

export const contentRouter = Router();

contentRouter.use(requireTenantUser);

contentRouter.use('/media', mediaRouter);

contentRouter.get('/site-settings', contentController.getSiteSettings);
contentRouter.put('/site-settings', contentController.updateSiteSettings);

contentRouter.get('/pages', contentController.listPages);
contentRouter.get('/pages/tree', contentController.listPageTree);
contentRouter.get('/pages/:id', contentController.getPage);
contentRouter.post('/pages', contentController.createPage);
contentRouter.put('/pages/:id', contentController.updatePage);
contentRouter.delete('/pages/:id', contentController.deletePage);
