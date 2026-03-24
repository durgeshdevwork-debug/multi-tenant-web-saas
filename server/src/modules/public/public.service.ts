import { LandingContent } from '../content/models/LandingContent';
import { AboutContent } from '../content/models/AboutContent';
import { ContactContent } from '../content/models/ContactContent';
import { Service } from '../content/models/Service';
import { BlogPost } from '../content/models/BlogPost';

export class PublicService {
  static async getSiteDetails(tenant: any) {
    await tenant.populate('templateId', 'name identifier modules');
    return {
      name: tenant.name,
      primaryDomain: tenant.primaryDomain,
      businessDetails: tenant.businessDetails,
      template: tenant.templateId
    };
  }

  static async getLanding(tenantId: string) {
    return await LandingContent.findOne({ tenantId });
  }

  static async getAbout(tenantId: string) {
    return await AboutContent.findOne({ tenantId });
  }

  static async getContact(tenantId: string) {
    return await ContactContent.findOne({ tenantId });
  }

  static async getServices(tenantId: string) {
    return await Service.find({ tenantId, isActive: true });
  }

  static async getBlogList(tenantId: string) {
    return await BlogPost.find({ tenantId, isPublished: true })
      .select('-body')
      .sort({ publishedAt: -1, createdAt: -1 });
  }

  static async getBlogPost(tenantId: string, slug: string) {
    return await BlogPost.findOne({ tenantId, slug, isPublished: true });
  }
}
