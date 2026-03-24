import { Router } from 'express';
import { 
  listTemplates, seedTemplate, 
  createClient, listClients, getClient, updateClient, regenerateApiKey 
} from './admin.controller';
import { requireAdmin } from '../../shared/middlewares/roleMiddleware';

export const adminRouter = Router();

// Protect all admin routes
adminRouter.use(requireAdmin);

// Templates
adminRouter.get('/templates', listTemplates);
adminRouter.post('/templates', seedTemplate);

// Clients (Tenants)
adminRouter.get('/clients', listClients);
adminRouter.post('/clients', createClient);
adminRouter.get('/clients/:id', getClient);
adminRouter.patch('/clients/:id', updateClient);
adminRouter.post('/clients/:id/refresh-key', regenerateApiKey);
