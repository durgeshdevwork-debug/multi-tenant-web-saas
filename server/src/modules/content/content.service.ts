import { Page } from './models/Page';
import { SiteSettings } from './models/SiteSettings';

type PageInput = Record<string, any> & {
  title: string;
  slug: string;
  parentId?: string | null;
  isHomePage?: boolean;
};

const normalizeSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const toObjectIdValue = (value?: string | null) => (value ? value : null);

const buildPagePath = (pageId: string, pagesById: Map<string, any>): string => {
  const page = pagesById.get(pageId);
  if (!page) return '/';
  if (page.isHomePage) return '/';
  if (!page.parentId) return `/${page.slug}`;

  const parentPath = buildPagePath(String(page.parentId), pagesById);
  return `${parentPath === '/' ? '' : parentPath}/${page.slug}`;
};

const enrichPages = (pages: any[]) => {
  const pagesById = new Map(pages.map((page) => [String(page._id), page]));

  return pages.map((page) => ({
    ...page,
    id: String(page._id),
    parentId: page.parentId ? String(page.parentId) : null,
    path: buildPagePath(String(page._id), pagesById)
  }));
};

const buildPageTree = (pages: any[]) => {
  const enriched = enrichPages(pages).sort((left, right) => {
    if (left.sortOrder !== right.sortOrder) return left.sortOrder - right.sortOrder;
    return left.title.localeCompare(right.title);
  });

  const byParent = new Map<string | null, any[]>();
  for (const page of enriched) {
    const key = page.parentId ?? null;
    const bucket = byParent.get(key) ?? [];
    bucket.push(page);
    byParent.set(key, bucket);
  }

  const attachChildren = (parentId: string | null): any[] =>
    (byParent.get(parentId) ?? []).map((page) => ({
      ...page,
      children: attachChildren(page.id)
    }));

  return attachChildren(null);
};

export class ContentService {
  static async listPages(tenantId: string) {
    const pages = await Page.find({ tenantId }).lean();
    return enrichPages(pages);
  }

  static async listPageTree(tenantId: string) {
    const pages = await Page.find({ tenantId }).lean();
    return buildPageTree(pages);
  }

  static async getPage(tenantId: string, id: string) {
    const page = await Page.findOne({ tenantId, _id: id }).lean();
    if (!page) return null;

    const pages = await Page.find({ tenantId }).select('_id parentId slug isHomePage sortOrder title').lean();
    return enrichPages([page, ...pages.filter((item) => String(item._id) !== String(page._id))])[0];
  }

  static async createPage(tenantId: string, data: PageInput) {
    const slug = normalizeSlug(data.slug || data.title);
    const parentId = data.isHomePage ? null : toObjectIdValue(data.parentId);

    if (data.isHomePage) {
      await Page.updateMany({ tenantId, isHomePage: true }, { $set: { isHomePage: false } });
    }

    return await Page.create({
      ...data,
      tenantId,
      slug,
      parentId,
      navigationLabel: data.navigationLabel || data.title
    });
  }

  static async updatePage(tenantId: string, id: string, data: Partial<PageInput>) {
    const updates: Record<string, any> = { ...data };

    if (typeof data.slug === 'string' || typeof data.title === 'string') {
      updates.slug = normalizeSlug(data.slug || data.title || '');
    }

    if ('parentId' in data) {
      updates.parentId = data.isHomePage ? null : toObjectIdValue(data.parentId ?? null);
    }

    if (data.isHomePage) {
      await Page.updateMany({ tenantId, isHomePage: true, _id: { $ne: id } }, { $set: { isHomePage: false } });
      updates.parentId = null;
    }

    return await Page.findOneAndUpdate({ tenantId, _id: id }, updates, { new: true });
  }

  static async deletePage(tenantId: string, id: string) {
    const pages = await Page.find({ tenantId }).select('_id parentId').lean();
    const descendants = new Set<string>([id]);
    let changed = true;

    while (changed) {
      changed = false;
      for (const page of pages) {
        if (page.parentId && descendants.has(String(page.parentId)) && !descendants.has(String(page._id))) {
          descendants.add(String(page._id));
          changed = true;
        }
      }
    }

    await Page.deleteMany({ tenantId, _id: { $in: Array.from(descendants) } });
    return { deletedIds: Array.from(descendants) };
  }

  static async getSiteSettings(tenantId: string) {
    return await SiteSettings.findOne({ tenantId });
  }

  static async updateSiteSettings(tenantId: string, data: any) {
    return await SiteSettings.findOneAndUpdate({ tenantId }, data, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    });
  }

  static async listPublishedPages(tenantId: string) {
    const pages = await Page.find({ tenantId, isPublished: true }).lean();
    return buildPageTree(pages);
  }

  static async getPublishedPageByPath(tenantId: string, path: string) {
    const pages = await Page.find({ tenantId, isPublished: true }).lean();
    const enriched = enrichPages(pages);
    const normalizedPath = path === '/' ? '/' : `/${path.replace(/^\/+|\/+$/g, '')}`;
    return enriched.find((page) => page.path === normalizedPath) ?? null;
  }
}
