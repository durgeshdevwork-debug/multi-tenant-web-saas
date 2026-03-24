import { Template } from '../templates/models/Template';
import { Tenant } from '../tenants/models/Tenant';
import { LandingContent } from '../content/models/LandingContent';
import { AboutContent } from '../content/models/AboutContent';
import { ContactContent } from '../content/models/ContactContent';
import { generateApiKey } from '../../shared/utils/apiKey';
import { auth } from '../../shared/utils/auth';
import { fromNodeHeaders } from 'better-auth/node';

export class AdminService {
  static async listTemplates() {
    return await Template.find();
  }

  static async seedTemplate(data: { name: string; identifier: string; modules: string[] }) {
    return await Template.create(data);
  }

  static async createClient(data: any, headers: any) {
    const { clientName, slug, primaryDomain, templateId, businessDetails, email, password } = data;

    const template = await Template.findById(templateId);
    if (!template) throw new Error('Template not found');

    const { apiKey, apiKeyHash, truncatedApiKey } = generateApiKey();

    const tenant = await Tenant.create({
      name: clientName,
      slug,
      primaryDomain,
      templateId,
      apiKeyHash,
      truncatedApiKey,
      status: 'active',
      businessDetails
    });

    const userRes = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: clientName,
        tenantId: String(tenant._id)
      } as any, // bypassing TS strict check for custom additional fields
      headers: fromNodeHeaders(headers)
    });

    if (!userRes?.user) {
      throw new Error('Failed to create user natively via better auth');
    }

    const modules = template.modules || [];
    if (modules.includes('landing')) {
      await LandingContent.create({ tenantId: tenant._id, heroTitle: `Welcome to ${clientName}`, highlights: [] });
    }
    if (modules.includes('about')) {
      await AboutContent.create({ tenantId: tenant._id, heading: `About ${clientName}`, description: 'Setup content', teamMembers: [] });
    }
    if (modules.includes('contact')) {
      await ContactContent.create({ tenantId: tenant._id, email });
    }

    return { tenant, user: userRes.user, apiKey };
  }

  static async listClients() {
    return await Tenant.find().populate('templateId', 'name identifier');
  }

  static async getClient(id: string) {
    const tenant = await Tenant.findById(id).populate('templateId');
    if (!tenant) throw new Error('Tenant not found');
    return tenant;
  }

  static async updateClient(id: string, updates: any) {
    delete updates.apiKeyHash;
    delete updates.truncatedApiKey;
    return await Tenant.findByIdAndUpdate(id, updates, { new: true });
  }

  static async regenerateApiKey(id: string) {
    const { apiKey, apiKeyHash, truncatedApiKey } = generateApiKey();
    const tenant = await Tenant.findByIdAndUpdate(
      id,
      { apiKeyHash, truncatedApiKey },
      { new: true }
    );
    if (!tenant) throw new Error('Tenant not found');
    return { tenant, apiKey };
  }
}
