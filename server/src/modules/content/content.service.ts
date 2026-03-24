import { LandingContent } from './models/LandingContent';
import { AboutContent } from './models/AboutContent';
import { ContactContent } from './models/ContactContent';
import { Service } from './models/Service';
import { BlogPost } from './models/BlogPost';

export class ContentService {
  // ----------------------
  // SINGLETONS
  // ----------------------

  static async getLanding(tenantId: string) {
    return await LandingContent.findOne({ tenantId });
  }

  static async updateLanding(tenantId: string, data: any) {
    return await LandingContent.findOneAndUpdate({ tenantId }, data, { new: true, upsert: true });
  }

  static async getAbout(tenantId: string) {
    return await AboutContent.findOne({ tenantId });
  }

  static async updateAbout(tenantId: string, data: any) {
    return await AboutContent.findOneAndUpdate({ tenantId }, data, { new: true, upsert: true });
  }

  static async getContact(tenantId: string) {
    return await ContactContent.findOne({ tenantId });
  }

  static async updateContact(tenantId: string, data: any) {
    return await ContactContent.findOneAndUpdate({ tenantId }, data, { new: true, upsert: true });
  }

  // ----------------------
  // COLLECTIONS: SERVICES
  // ----------------------

  static async listServices(tenantId: string) {
    return await Service.find({ tenantId });
  }

  static async createService(tenantId: string, data: any) {
    return await Service.create({ ...data, tenantId });
  }

  static async updateService(tenantId: string, id: string, data: any) {
    return await Service.findOneAndUpdate({ _id: id, tenantId }, data, { new: true });
  }

  static async deleteService(tenantId: string, id: string) {
    return await Service.findOneAndDelete({ _id: id, tenantId });
  }

  // ----------------------
  // COLLECTIONS: BLOG
  // ----------------------

  static async listBlogPosts(tenantId: string) {
    return await BlogPost.find({ tenantId }).sort({ createdAt: -1 });
  }

  static async createBlogPost(tenantId: string, data: any) {
    return await BlogPost.create({ ...data, tenantId });
  }

  static async updateBlogPost(tenantId: string, id: string, data: any) {
    return await BlogPost.findOneAndUpdate({ _id: id, tenantId }, data, { new: true });
  }

  static async deleteBlogPost(tenantId: string, id: string) {
    return await BlogPost.findOneAndDelete({ _id: id, tenantId });
  }
}
