import { Types } from 'mongoose';
import { Testimonial } from './models/Testimonial';

type TestimonialInput = Record<string, any> & {
  collectionId: string;
  authorName: string;
};

const normalizeCollectionId = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const toCollectionLabel = (collectionId: string) =>
  collectionId
    .split('-')
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(' ') || collectionId;

export class TestimonialService {
  static async listCollections(tenantId: string) {
    const collections = await Testimonial.aggregate([
      { $match: { tenantId: new Types.ObjectId(tenantId) } },
      {
        $group: {
          _id: '$collectionId',
          count: { $sum: 1 },
          updatedAt: { $max: '$updatedAt' }
        }
      },
      { $sort: { updatedAt: -1, _id: 1 } }
    ]);

    return collections.map((collection) => ({
      id: String(collection._id),
      label: toCollectionLabel(String(collection._id)),
      count: collection.count
    }));
  }

  static async listTestimonials(tenantId: string, collectionId?: string) {
    const filter: Record<string, any> = { tenantId };
    if (collectionId) {
      filter.collectionId = collectionId;
    }

    return await Testimonial.find(filter).sort({ sortOrder: 1, createdAt: -1 }).lean();
  }

  static async listPublishedTestimonials(tenantId: string, collectionId?: string, selectedIds: string[] = []) {
    const filter: Record<string, any> = { tenantId, isPublished: true };
    if (collectionId) {
      filter.collectionId = collectionId;
    }

    const testimonials = await Testimonial.find(filter).sort({ sortOrder: 1, createdAt: -1 }).lean();
    const selectedSet = new Set(selectedIds.map(String));

    const ordered = selectedIds.length
      ? testimonials
          .filter((item) => selectedSet.has(String(item._id)))
          .sort((left, right) => {
            return selectedIds.indexOf(String(left._id)) - selectedIds.indexOf(String(right._id));
          })
      : testimonials;

    return ordered.map((testimonial: any) => ({
      id: String(testimonial._id),
      collectionId: testimonial.collectionId,
      format: testimonial.format,
      title: testimonial.title,
      body: testimonial.body,
      authorName: testimonial.authorName,
      authorRole: testimonial.authorRole,
      company: testimonial.company,
      avatarUrl: testimonial.avatarUrl,
      mediaUrl: testimonial.mediaUrl,
      thumbnailUrl: testimonial.thumbnailUrl,
      rating: testimonial.rating,
      sortOrder: testimonial.sortOrder
    }));
  }

  static async getTestimonial(tenantId: string, id: string) {
    return await Testimonial.findOne({ tenantId, _id: id }).lean();
  }

  static async createTestimonial(tenantId: string, data: TestimonialInput) {
    const collectionId = normalizeCollectionId(data.collectionId || 'general');
    return await Testimonial.create({
      ...data,
      tenantId,
      collectionId,
      authorName: data.authorName?.trim(),
      title: data.title?.trim(),
      authorRole: data.authorRole?.trim(),
      company: data.company?.trim(),
      avatarUrl: data.avatarUrl?.trim(),
      mediaUrl: data.mediaUrl?.trim(),
      thumbnailUrl: data.thumbnailUrl?.trim()
    });
  }

  static async updateTestimonial(tenantId: string, id: string, data: Partial<TestimonialInput>) {
    const testimonial = await Testimonial.findOne({ tenantId, _id: id });
    if (!testimonial) return null;

    if (data.collectionId !== undefined) testimonial.collectionId = normalizeCollectionId(data.collectionId);
    if (data.format !== undefined) testimonial.format = data.format;
    if (data.title !== undefined) testimonial.title = data.title.trim();
    if (data.body !== undefined) testimonial.body = data.body;
    if (data.authorName !== undefined) testimonial.authorName = data.authorName.trim();
    if (data.authorRole !== undefined) testimonial.authorRole = data.authorRole.trim();
    if (data.company !== undefined) testimonial.company = data.company.trim();
    if (data.avatarUrl !== undefined) testimonial.avatarUrl = data.avatarUrl.trim();
    if (data.mediaUrl !== undefined) testimonial.mediaUrl = data.mediaUrl.trim();
    if (data.thumbnailUrl !== undefined) testimonial.thumbnailUrl = data.thumbnailUrl.trim();
    if (data.rating !== undefined) testimonial.rating = data.rating;
    if (data.sortOrder !== undefined) testimonial.sortOrder = data.sortOrder;
    if (data.isPublished !== undefined) testimonial.isPublished = data.isPublished;

    return await testimonial.save();
  }

  static async deleteTestimonial(tenantId: string, id: string) {
    const testimonial = await Testimonial.findOneAndDelete({ tenantId, _id: id });
    if (!testimonial) return null;
    return { deletedId: String(testimonial._id) };
  }
}
