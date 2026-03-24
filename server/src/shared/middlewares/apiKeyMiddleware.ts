import { Request, Response, NextFunction } from 'express';
import { hashApiKey } from '../utils/apiKey';
import { Tenant } from '../../modules/tenants/models/Tenant';

export const requireApiKey = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const apiKey = req.params.apiKey as string;
    if (!apiKey) {
      res.status(401).json({ success: false, message: 'API Key missing' });
      return;
    }

    const hashedKey = hashApiKey(apiKey);
    const tenant = await Tenant.findOne({ apiKeyHash: hashedKey, status: 'active' });

    if (!tenant) {
      res.status(401).json({ success: false, message: 'Invalid or inactive API Key' });
      return;
    }

    // Attach tenant to request
    (req as any).tenant = tenant;
    next();
  } catch (err) {
    next(err);
  }
};
