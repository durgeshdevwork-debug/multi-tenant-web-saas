import { useEffect, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2, Save } from "lucide-react"

import { MediaAssetPicker } from "@/components/media-asset-picker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { FormHeader } from "@/components/forms/form-header"
import { FormSection } from "@/components/forms/form-section"
import { StickyActions } from "@/components/forms/sticky-actions"
import { getSiteSettings, updateSiteSettings } from "@/features/content/services/site-settings.api"
import type { SiteSettings } from "@/features/content/types"
import { useQuery } from "@tanstack/react-query"

const defaultSettings: SiteSettings = {
  siteName: "",
  domain: "",
  logo: {
    url: "",
    alt: "",
  },
  favicon: "",
  business: {
    email: "",
    phone: "",
    address: "",
  },
  social: {
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: "",
  },
  seo: {
    defaultTitle: "",
    defaultDescription: "",
    ogImage: "",
  },
  theme: {
    primaryColor: "",
    secondaryColor: "",
    fontFamily: "",
  },
}

export function SiteSettingsPage() {
  const queryClient = useQueryClient()
  const settingsQuery = useQuery({
    queryKey: ["content", "site-settings"],
    queryFn: getSiteSettings,
  })

  const [form, setForm] = useState<SiteSettings>(defaultSettings)

  useEffect(() => {
    if (!settingsQuery.data) return

    const data = settingsQuery.data
    setForm({
      ...defaultSettings,
      ...data,
      logo: {
        url: data.logo?.url ?? "",
        alt: data.logo?.alt ?? "",
      },
      business: {
        ...defaultSettings.business,
        ...data.business,
      },
      social: {
        ...defaultSettings.social,
        ...data.social,
      },
      seo: {
        ...defaultSettings.seo,
        ...data.seo,
      },
      theme: {
        ...defaultSettings.theme,
        ...data.theme,
      },
    })
  }, [settingsQuery.data])

  const saveMutation = useMutation({
    mutationFn: updateSiteSettings,
    onSuccess: (next) => {
      setForm((prev) => ({
        ...prev,
        ...next,
      }))
      queryClient.invalidateQueries({ queryKey: ["content", "site-settings"] })
    },
  })

  const isSaving = saveMutation.isPending

  return (
    <div className="flex min-h-0 flex-1 flex-col rounded-2xl border bg-card/90 shadow-xl">
      <FormHeader
        title="Global Site Settings"
        description="Configure the website identity, business details, SEO defaults, and design tokens used across the site."
      />
      <StickyActions>
        <Button
          form="site-settings-form"
          type="submit"
          disabled={isSaving}
        >
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Settings
        </Button>
      </StickyActions>

      <ScrollArea className="h-full min-h-0">
        <form
          id="site-settings-form"
          className="space-y-6 p-5"
          onSubmit={(event) => {
            event.preventDefault()
            saveMutation.mutate(form)
          }}
        >
          <FormSection
            title="Branding"
            description="Control the logo, favicon, and public-facing site name."
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={form.siteName}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      siteName: event.target.value,
                    }))
                  }
                  placeholder="Acme Studio"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="domain">Domain</Label>
                <Input
                  id="domain"
                  value={form.domain ?? ""}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, domain: event.target.value }))
                  }
                  placeholder="www.acme.com"
                />
              </div>
              <MediaAssetPicker
                label="Logo"
                value={form.logo?.url ?? ""}
                onChange={(url) =>
                  setForm((prev) => ({
                    ...prev,
                    logo: {
                      url,
                      alt: prev.logo?.alt ?? "",
                    },
                  }))
                }
                helperText="Use your primary brand mark for the header and footer."
              />
              <div className="space-y-2">
                <Label htmlFor="logoAlt">Logo Alt Text</Label>
                <Input
                  id="logoAlt"
                  value={form.logo?.alt ?? ""}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      logo: {
                        ...(prev.logo ?? { url: "" }),
                        alt: event.target.value,
                      },
                    }))
                  }
                  placeholder="Acme Studio logo"
                />
              </div>
              <MediaAssetPicker
                label="Favicon"
                value={form.favicon ?? ""}
                onChange={(url) =>
                  setForm((prev) => ({ ...prev, favicon: url }))
                }
                helperText="Small browser icon used in tabs and bookmarks."
              />
            </div>
          </FormSection>

          <FormSection
            title="Business & Social"
            description="Public contact details and social links."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="businessEmail">Business Email</Label>
                <Input
                  id="businessEmail"
                  type="email"
                  value={form.business.email ?? ""}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      business: { ...prev.business, email: event.target.value },
                    }))
                  }
                  placeholder="hello@acme.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessPhone">Phone</Label>
                <Input
                  id="businessPhone"
                  value={form.business.phone ?? ""}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      business: { ...prev.business, phone: event.target.value },
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
                  value={form.business.address ?? ""}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      business: {
                        ...prev.business,
                        address: event.target.value,
                      },
                    }))
                  }
                  placeholder="123 Main Street, City, Country"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={form.social.facebook ?? ""}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      social: { ...prev.social, facebook: event.target.value },
                    }))
                  }
                  placeholder="https://facebook.com/acme"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={form.social.instagram ?? ""}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      social: { ...prev.social, instagram: event.target.value },
                    }))
                  }
                  placeholder="https://instagram.com/acme"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={form.social.linkedin ?? ""}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      social: { ...prev.social, linkedin: event.target.value },
                    }))
                  }
                  placeholder="https://linkedin.com/company/acme"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  value={form.social.twitter ?? ""}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      social: { ...prev.social, twitter: event.target.value },
                    }))
                  }
                  placeholder="https://x.com/acme"
                />
              </div>
            </div>
          </FormSection>

          <FormSection
            title="SEO Defaults"
            description="Set the fallback metadata used across the website."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="defaultTitle">Default Title</Label>
                <Input
                  id="defaultTitle"
                  value={form.seo.defaultTitle ?? ""}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      seo: { ...prev.seo, defaultTitle: event.target.value },
                    }))
                  }
                  placeholder="Acme Studio"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="defaultDescription">Default Description</Label>
                <Input
                  id="defaultDescription"
                  value={form.seo.defaultDescription ?? ""}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      seo: {
                        ...prev.seo,
                        defaultDescription: event.target.value,
                      },
                    }))
                  }
                  placeholder="A modern website for growing brands."
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <MediaAssetPicker
                  label="OG Image"
                  value={form.seo.ogImage ?? ""}
                  onChange={(url) =>
                    setForm((prev) => ({
                      ...prev,
                      seo: { ...prev.seo, ogImage: url },
                    }))
                  }
                />
              </div>
            </div>
          </FormSection>

          <FormSection
            title="Theme Tokens"
            description="Adjust the global visual palette from one place."
          >
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <Input
                  id="primaryColor"
                  value={form.theme?.primaryColor ?? ""}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      theme: {
                        ...(prev.theme ?? {}),
                        primaryColor: event.target.value,
                      },
                    }))
                  }
                  placeholder="#0f766e"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <Input
                  id="secondaryColor"
                  value={form.theme?.secondaryColor ?? ""}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      theme: {
                        ...(prev.theme ?? {}),
                        secondaryColor: event.target.value,
                      },
                    }))
                  }
                  placeholder="#111827"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fontFamily">Font Family</Label>
                <Input
                  id="fontFamily"
                  value={form.theme?.fontFamily ?? ""}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      theme: {
                        ...(prev.theme ?? {}),
                        fontFamily: event.target.value,
                      },
                    }))
                  }
                  placeholder="Inter, sans-serif"
                />
              </div>
            </div>
          </FormSection>
        </form>
      </ScrollArea>
    </div>
  )
}
