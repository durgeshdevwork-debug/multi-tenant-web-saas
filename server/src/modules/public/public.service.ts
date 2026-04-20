import { LandingContent } from '../content/models/LandingContent';
import { AboutContent } from '../content/models/AboutContent';
import { ContactContent } from '../content/models/ContactContent';
import { Service } from '../content/models/Service';
import { BlogPost } from '../content/models/BlogPost';
import { Navigation, type INavigationItem, type NavigationPageKey } from '../content/models/Navigation';
import { SiteSettings } from '../content/models/SiteSettings';
import { DEFAULT_PAGE_ORDER, PAGE_DEFINITIONS } from '../content/content.defaults';

type PublicNavItem = INavigationItem & {
  href: string;
  children: PublicNavItem[];
};

const resolveNavigationHref = (item: { pageKey?: NavigationPageKey; url?: string }) => {
  if (item.pageKey) {
    return PAGE_DEFINITIONS[item.pageKey]?.href ?? '/';
  }

  return item.url ?? '#';
};

const decorateNavItems = (items: INavigationItem[] = []): PublicNavItem[] =>
  items.map((item) => ({
    ...item,
    href: resolveNavigationHref(item),
    children: decorateNavItems(item.children ?? [])
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
    await tenant.populate('templateId', 'name identifier modules');

    const [settings, navigation] = await Promise.all([
      SiteSettings.findOne({ tenantId: tenant._id }),
      Navigation.findOne({ tenantId: tenant._id })
    ]);

    const activeModules = tenant.templateId?.modules ?? DEFAULT_PAGE_ORDER;
    const defaultHeader = DEFAULT_PAGE_ORDER.filter((pageKey) => activeModules.includes(pageKey)).map((pageKey) => ({
      label: PAGE_DEFINITIONS[pageKey].label,
      pageKey,
      href: PAGE_DEFINITIONS[pageKey].href,
      newTab: false,
      children: []
    }));

    const defaultFooter = [
      {
        title: 'Pages',
        links: defaultHeader
      }
    ];

    return {
      siteSettings: {
        siteName: settings?.siteName || tenant.name,
        domain: settings?.domain || tenant.primaryDomain,
        logo: settings?.logo,
        favicon: settings?.favicon,
        business: {
          email: settings?.business?.email,
          phone: settings?.business?.phone || tenant.businessDetails?.phone,
          address: settings?.business?.address || tenant.businessDetails?.address
        },
        social: settings?.social || {},
        seo: settings?.seo || {},
        theme: settings?.theme || {}
      },
      navigation: {
        header: decorateNavItems((navigation?.header as INavigationItem[] | undefined) ?? defaultHeader),
        footer:
          navigation?.footer?.map((section) => ({
            ...section,
            links: decorateNavItems(section.links as INavigationItem[])
          })) ?? defaultFooter,
        copyright:
          navigation?.copyright || `(c) ${new Date().getFullYear()} ${settings?.siteName || tenant.name}`
      }
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
