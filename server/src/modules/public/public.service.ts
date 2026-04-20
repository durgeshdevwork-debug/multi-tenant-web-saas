import { ContentService } from '../content/content.service';
import { SiteSettings } from '../content/models/SiteSettings';

type NavigationPageNode = {
  id: string;
  title: string;
  label: string;
  slug: string;
  path: string;
  children: NavigationPageNode[];
};

const filterNavigationPages = (pages: any[], key: 'showInHeader' | 'showInFooter'): NavigationPageNode[] =>
  pages
    .filter((page) => page[key])
    .map((page) => ({
      id: page.id,
      title: page.title,
      label: page.navigationLabel || page.title,
      slug: page.slug,
      path: page.path,
      children: filterNavigationPages(page.children ?? [], key)
    }));

export class PublicService {
  static async getSiteDetails(tenant: any) {
    await tenant.populate('templateId', 'name identifier modules');
    const settings = await SiteSettings.findOne({ tenantId: tenant._id });

    return {
      name: settings?.siteName || tenant.name,
      primaryDomain: settings?.domain || tenant.primaryDomain,
      businessDetails: {
        email: settings?.business?.email,
        phone: settings?.business?.phone || tenant.businessDetails?.phone,
        address: settings?.business?.address || tenant.businessDetails?.address,
        name: tenant.businessDetails?.name
      },
      logo: settings?.logo,
      seo: settings?.seo,
      theme: settings?.theme,
      template: tenant.templateId
    };
  }

  static async getLayout(tenant: any) {
    const [settings, pages] = await Promise.all([
      SiteSettings.findOne({ tenantId: tenant._id }),
      ContentService.listPublishedPages(String(tenant._id))
    ]);

    return {
      siteSettings: {
        siteName: settings?.siteName || tenant.name,
        domain: settings?.domain || tenant.primaryDomain,
        logo: settings?.logo,
        favicon: settings?.favicon,
        business: settings?.business || {},
        social: settings?.social || {},
        seo: settings?.seo || {},
        theme: settings?.theme || {}
      },
      navigation: {
        header: filterNavigationPages(pages, 'showInHeader'),
        footer: filterNavigationPages(pages, 'showInFooter')
      }
    };
  }

  static async getPages(tenantId: string) {
    return await ContentService.listPublishedPages(tenantId);
  }

  static async getPageByPath(tenantId: string, path: string) {
    return await ContentService.getPublishedPageByPath(tenantId, path);
  }
}
