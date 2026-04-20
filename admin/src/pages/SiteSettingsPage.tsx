import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Globe, ImagePlus, Loader2, Palette, Save, Search, Share2 } from 'lucide-react';

import { MediaAssetPicker } from '@/components/media-asset-picker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getSiteSettings, updateSiteSettings, type SiteSettings } from '@/lib/api';

const defaultSettings: SiteSettings = {
  siteName: '',
  domain: '',
  logo: {
    url: '',
    alt: ''
  },
  favicon: '',
  business: {
    email: '',
    phone: '',
    address: ''
  },
  social: {
    facebook: '',
    instagram: '',
    linkedin: '',
    twitter: ''
  },
  seo: {
    defaultTitle: '',
    defaultDescription: '',
    ogImage: ''
  },
  theme: {
    primaryColor: '',
    secondaryColor: '',
    fontFamily: ''
  }
};

export function SiteSettingsPage() {
  const queryClient = useQueryClient();
  const settingsQuery = useQuery({
    queryKey: ['content', 'site-settings'],
    queryFn: getSiteSettings
  });

  const [form, setForm] = useState<SiteSettings>(defaultSettings);

  useEffect(() => {
    if (settingsQuery.data) {
      const data = settingsQuery.data as SiteSettings;
      setForm({
        ...defaultSettings,
        ...data,
        logo: {
          ...defaultSettings.logo,
          ...data.logo
        },
        business: {
          ...defaultSettings.business,
          ...data.business
        },
        social: {
          ...defaultSettings.social,
          ...data.social
        },
        seo: {
          ...defaultSettings.seo,
          ...data.seo
        },
        theme: {
          ...defaultSettings.theme,
          ...data.theme
        }
      });
    }
  }, [settingsQuery.data]);

  const saveMutation = useMutation({
    mutationFn: updateSiteSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', 'site-settings'] });
    }
  });

  return (
    <Card className="border-none bg-gradient-to-br from-card to-muted/10 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Globe className="h-6 w-6 text-primary" /> Global Site Settings
        </CardTitle>
        <CardDescription>
          Configure the website-wide identity, business details, SEO defaults, and brand styling used across every page.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="site-settings-form"
          className="space-y-8"
          onSubmit={(event) => {
            event.preventDefault();
            saveMutation.mutate(form);
          }}
        >
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-2 text-lg font-semibold">
              <ImagePlus className="h-5 w-5 text-primary" /> Branding
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={form.siteName}
                  onChange={(event) => setForm((prev) => ({ ...prev, siteName: event.target.value }))}
                  placeholder="Acme Studio"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="domain">Domain</Label>
                <Input
                  id="domain"
                  value={form.domain ?? ''}
                  onChange={(event) => setForm((prev) => ({ ...prev, domain: event.target.value }))}
                  placeholder="www.acme.com"
                />
              </div>
              <MediaAssetPicker
                label="Logo"
                value={form.logo?.url ?? ''}
                onChange={(url) => setForm((prev) => ({ ...prev, logo: { ...(prev.logo ?? { alt: '' }), url } }))}
                helperText="Use your primary brand mark for the header and footer."
              />
              <div className="space-y-2">
                <Label htmlFor="logoAlt">Logo Alt Text</Label>
                <Input
                  id="logoAlt"
                  value={form.logo?.alt ?? ''}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      logo: { ...(prev.logo ?? { url: '' }), alt: event.target.value }
                    }))
                  }
                  placeholder="Acme Studio logo"
                />
              </div>
              <MediaAssetPicker
                label="Favicon"
                value={form.favicon ?? ''}
                onChange={(url) => setForm((prev) => ({ ...prev, favicon: url }))}
                helperText="Small browser icon used in tabs and bookmarks."
              />
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-2 text-lg font-semibold">
              <Share2 className="h-5 w-5 text-primary" /> Business & Social
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="businessEmail">Business Email</Label>
                <Input
                  id="businessEmail"
                  type="email"
                  value={form.business.email ?? ''}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      business: { ...prev.business, email: event.target.value }
                    }))
                  }
                  placeholder="hello@acme.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessPhone">Phone</Label>
                <Input
                  id="businessPhone"
                  value={form.business.phone ?? ''}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      business: { ...prev.business, phone: event.target.value }
                    }))
                  }
                  placeholder="+1 555-0123"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="businessAddress">Address</Label>
                <Textarea
                  id="businessAddress"
                  rows={3}
                  value={form.business.address ?? ''}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      business: { ...prev.business, address: event.target.value }
                    }))
                  }
                  placeholder="123 Main Street, City, Country"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={form.social.facebook ?? ''}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      social: { ...prev.social, facebook: event.target.value }
                    }))
                  }
                  placeholder="https://facebook.com/your-page"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={form.social.instagram ?? ''}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      social: { ...prev.social, instagram: event.target.value }
                    }))
                  }
                  placeholder="https://instagram.com/your-handle"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={form.social.linkedin ?? ''}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      social: { ...prev.social, linkedin: event.target.value }
                    }))
                  }
                  placeholder="https://linkedin.com/company/your-brand"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter / X</Label>
                <Input
                  id="twitter"
                  value={form.social.twitter ?? ''}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      social: { ...prev.social, twitter: event.target.value }
                    }))
                  }
                  placeholder="https://x.com/your-handle"
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-2 text-lg font-semibold">
              <Search className="h-5 w-5 text-primary" /> Default SEO
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="defaultTitle">Default Title</Label>
                <Input
                  id="defaultTitle"
                  value={form.seo.defaultTitle ?? ''}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      seo: { ...prev.seo, defaultTitle: event.target.value }
                    }))
                  }
                  placeholder="Acme Studio"
                />
              </div>
              <MediaAssetPicker
                label="Open Graph Image"
                value={form.seo.ogImage ?? ''}
                onChange={(url) =>
                  setForm((prev) => ({
                    ...prev,
                    seo: { ...prev.seo, ogImage: url }
                  }))
                }
                helperText="Used when your site is shared on social platforms."
              />
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="defaultDescription">Default Description</Label>
                <Textarea
                  id="defaultDescription"
                  rows={4}
                  value={form.seo.defaultDescription ?? ''}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      seo: { ...prev.seo, defaultDescription: event.target.value }
                    }))
                  }
                  placeholder="Describe the business and what visitors should expect."
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-2 text-lg font-semibold">
              <Palette className="h-5 w-5 text-primary" /> Theme
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <Input
                  id="primaryColor"
                  value={form.theme?.primaryColor ?? ''}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      theme: { ...(prev.theme ?? {}), primaryColor: event.target.value }
                    }))
                  }
                  placeholder="#0f172a"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <Input
                  id="secondaryColor"
                  value={form.theme?.secondaryColor ?? ''}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      theme: { ...(prev.theme ?? {}), secondaryColor: event.target.value }
                    }))
                  }
                  placeholder="#f97316"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fontFamily">Font Family</Label>
                <Input
                  id="fontFamily"
                  value={form.theme?.fontFamily ?? ''}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      theme: { ...(prev.theme ?? {}), fontFamily: event.target.value }
                    }))
                  }
                  placeholder="Georgia, serif"
                />
              </div>
            </div>
          </section>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end border-t bg-muted/50 py-4">
        <Button form="site-settings-form" type="submit" disabled={saveMutation.isPending}>
          {saveMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Site Settings
        </Button>
      </CardFooter>
    </Card>
  );
}
