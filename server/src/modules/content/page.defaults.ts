import type { PageSectionType } from './models/Page';

type PageSectionSeed = {
  id: string;
  type: PageSectionType;
  name?: string;
  content: Record<string, unknown>;
  styles?: Record<string, unknown>;
};

type PageSeed = {
  title: string;
  slug: string;
  navigationLabel?: string;
  isHomePage?: boolean;
  showInHeader?: boolean;
  showInFooter?: boolean;
  sortOrder: number;
  sections: PageSectionSeed[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
  };
};

const createHeroSection = (clientName: string): PageSectionSeed => ({
  id: 'hero-1',
  type: 'hero',
  name: 'Hero',
  content: {
    eyebrow: 'Welcome',
    heading: `Grow with ${clientName}`,
    body: 'Use this hero section to explain your core offer and guide visitors to the next step.',
    buttonLabel: 'Contact Us',
    buttonUrl: '/contact',
    imageUrl: ''
  }
});

const createFeaturesSection = (): PageSectionSeed => ({
  id: 'features-1',
  type: 'features',
  name: 'Highlights',
  content: {
    heading: 'What makes this page useful',
    items: [
      { title: 'Flexible sections', description: 'Add and reorder content blocks without changing code.', imageUrl: '' },
      { title: 'Reusable layout', description: 'Keep the same page system across your full website.', imageUrl: '' },
      { title: 'Built for growth', description: 'Extend this structure as new sections are introduced.', imageUrl: '' }
    ]
  }
});

const createRichTextSection = (heading: string, body: string): PageSectionSeed => ({
  id: `${heading.toLowerCase().replace(/\s+/g, '-')}-1`,
  type: 'richText',
  name: heading,
  content: {
    heading,
    body
  }
});

const createCtaSection = (): PageSectionSeed => ({
  id: 'cta-1',
  type: 'cta',
  name: 'Call To Action',
  content: {
    heading: 'Ready to update this page?',
    body: 'Edit this CTA block from the CMS and connect it to any page or external link.',
    buttonLabel: 'Get Started',
    buttonUrl: '/'
  }
});

export const buildInitialPages = (clientName: string, modules: string[] = []): PageSeed[] => {
  const normalizedModules = new Set(modules.length > 0 ? modules : ['landing']);

  const seeds: PageSeed[] = [
    {
      title: 'Home',
      slug: 'home',
      navigationLabel: 'Home',
      isHomePage: true,
      sortOrder: 0,
      sections: [createHeroSection(clientName), createFeaturesSection(), createCtaSection()],
      seo: {
        metaTitle: clientName,
        metaDescription: `Welcome to ${clientName}`
      }
    }
  ];

  if (normalizedModules.has('about')) {
    seeds.push({
      title: 'About',
      slug: 'about',
      navigationLabel: 'About',
      sortOrder: 10,
      sections: [
        createRichTextSection('About Us', `Tell the story of ${clientName} and explain how the business helps customers.`),
        createFeaturesSection()
      ]
    });
  }

  if (normalizedModules.has('services')) {
    seeds.push({
      title: 'Services',
      slug: 'services',
      navigationLabel: 'Services',
      sortOrder: 20,
      sections: [
        createRichTextSection('Services', 'Outline your main offers and describe the value of each service.'),
        {
          id: 'services-gallery',
          type: 'gallery',
          name: 'Service Grid',
          content: {
            heading: 'Featured Services',
            items: [
              { title: 'Service One', description: 'Describe the first service.', imageUrl: '' },
              { title: 'Service Two', description: 'Describe the second service.', imageUrl: '' },
              { title: 'Service Three', description: 'Describe the third service.', imageUrl: '' }
            ]
          }
        }
      ]
    });
  }

  if (normalizedModules.has('blog')) {
    seeds.push({
      title: 'Insights',
      slug: 'insights',
      navigationLabel: 'Insights',
      sortOrder: 30,
      sections: [
        createRichTextSection('Insights', 'Use this page for articles, news, or thought leadership content.'),
        createCtaSection()
      ]
    });
  }

  if (normalizedModules.has('contact')) {
    seeds.push({
      title: 'Contact',
      slug: 'contact',
      navigationLabel: 'Contact',
      sortOrder: 40,
      sections: [
        createRichTextSection('Contact', 'Share the best way for visitors to reach your team.'),
        createCtaSection()
      ]
    });
  }

  return seeds;
};
