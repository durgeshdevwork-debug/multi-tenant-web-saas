import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import {
  getLanding, updateLanding,
  getAbout, updateAbout,
  getContact, updateContact,
  listServices, createService, updateService, deleteService,
  listBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost,
  type AboutContent, type BlogPost, type ContactContent, type LandingContent, type ServiceItem
} from '@/lib/api';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { MediaAssetPicker } from '@/components/media-asset-picker';
import { Loader2, Plus, Trash2, Edit2, LayoutTemplate, Info, Briefcase, FileText, Mail, Save } from 'lucide-react';

const tabs = ['landing', 'about', 'services', 'blog', 'contact'] as const;
type Tab = (typeof tabs)[number];

export function UserDashboard() {
  const location = useLocation();
  const activeTab = useMemo<Tab>(() => {
    const pathname = location.pathname.replace(/^\//, '');
    return (tabs.find((tab) => tab === pathname) ?? 'landing') as Tab;
  }, [location.pathname]);

  return (
    <div className="container mx-auto max-w-6xl animate-in fade-in zoom-in-95 duration-500 p-4 md:p-8">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-extrabold tracking-tight lg:text-5xl">Website Content</h1>
        <p className="text-lg text-muted-foreground">Manage the content, sections, and pages of your public site.</p>
      </div>

      <Tabs value={activeTab} className="space-y-6">
        <TabsList className="hidden">
          <TabsTrigger value="landing" className="flex items-center gap-2 rounded-md px-6 py-2">
            <LayoutTemplate className="h-4 w-4" /> Landing
          </TabsTrigger>
          <TabsTrigger value="about" className="flex items-center gap-2 rounded-md px-6 py-2">
            <Info className="h-4 w-4" /> About
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2 rounded-md px-6 py-2">
            <Briefcase className="h-4 w-4" /> Services
          </TabsTrigger>
          <TabsTrigger value="blog" className="flex items-center gap-2 rounded-md px-6 py-2">
            <FileText className="h-4 w-4" /> Blog
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2 rounded-md px-6 py-2">
            <Mail className="h-4 w-4" /> Contact
          </TabsTrigger>
        </TabsList>

        <TabsContent value="landing" className="mt-0"><LandingSection /></TabsContent>
        <TabsContent value="about" className="mt-0"><AboutSection /></TabsContent>
        <TabsContent value="services" className="mt-0"><ServicesSection /></TabsContent>
        <TabsContent value="blog" className="mt-0"><BlogSection /></TabsContent>
        <TabsContent value="contact" className="mt-0"><ContactSection /></TabsContent>
      </Tabs>
    </div>
  );
}

function LandingSection() {
  const queryClient = useQueryClient();
  const landingQuery = useQuery({
    queryKey: ['content', 'landing'],
    queryFn: getLanding
  });

  const [form, setForm] = useState<LandingContent>({
    heroTitle: '',
    heroSubtitle: '',
    heroImageUrl: '',
    primaryCtaText: '',
    primaryCtaUrl: '',
    highlights: []
  });

  useEffect(() => {
    const data = landingQuery.data as LandingContent | undefined;
    if (data) {
      setForm({
        heroTitle: data.heroTitle ?? '',
        heroSubtitle: data.heroSubtitle ?? '',
        heroImageUrl: data.heroImageUrl ?? '',
        primaryCtaText: data.primaryCtaText ?? '',
        primaryCtaUrl: data.primaryCtaUrl ?? '',
        highlights: data.highlights ?? []
      });
    }
  }, [landingQuery.data]);

  const updateMutation = useMutation({
    mutationFn: updateLanding,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['content', 'landing'] })
  });

  return (
    <Card className="border-none bg-gradient-to-br from-card to-muted/10 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <LayoutTemplate className="h-6 w-6 text-primary" /> Landing Page Settings
        </CardTitle>
        <CardDescription>Configure the main hero banner, text, and bullet point highlights.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="landing-form"
          className="max-w-4xl space-y-8"
          onSubmit={(event) => {
            event.preventDefault();
            updateMutation.mutate(form);
          }}
        >
          <div className="space-y-4">
            <h3 className="border-b pb-2 text-lg font-semibold">Hero Section</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="heroTitle">Hero Title</Label>
                <Input
                  id="heroTitle"
                  placeholder="Welcome to our site"
                  value={form.heroTitle}
                  onChange={(event) => setForm((prev) => ({ ...prev, heroTitle: event.target.value }))}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="heroSubtitle">Hero Subtitle / Description</Label>
                <Textarea
                  id="heroSubtitle"
                  placeholder="We offer the best services for your needs..."
                  value={form.heroSubtitle ?? ''}
                  onChange={(event) => setForm((prev) => ({ ...prev, heroSubtitle: event.target.value }))}
                  rows={3}
                />
              </div>
              <MediaAssetPicker
                className="md:col-span-2"
                label="Hero image"
                value={form.heroImageUrl ?? ''}
                onChange={(url) => setForm((prev) => ({ ...prev, heroImageUrl: url }))}
                helperText="Pick an existing image from the media library or upload a new one."
              />
              <div className="space-y-2">
                <Label htmlFor="primaryCtaText">Call to Action (CTA) Text</Label>
                <Input
                  id="primaryCtaText"
                  placeholder="Get Started"
                  value={form.primaryCtaText ?? ''}
                  onChange={(event) => setForm((prev) => ({ ...prev, primaryCtaText: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="primaryCtaUrl">CTA URL / Link</Label>
                <Input
                  id="primaryCtaUrl"
                  placeholder="/contact"
                  value={form.primaryCtaUrl ?? ''}
                  onChange={(event) => setForm((prev) => ({ ...prev, primaryCtaUrl: event.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="border-b pb-2 text-lg font-semibold">Highlights</h3>
            <div className="space-y-4">
              {form.highlights.map((highlight, index) => (
                <div key={`${highlight.title}-${index}`} className="flex flex-col items-start gap-4 rounded-lg border bg-muted/30 p-4 md:flex-row">
                  <div className="w-full flex-1 space-y-2">
                    <Label>Title</Label>
                    <Input
                      placeholder="Highlight title..."
                      value={highlight.title}
                      onChange={(event) =>
                        setForm((prev) => {
                          const next = [...prev.highlights];
                          next[index] = { ...next[index], title: event.target.value };
                          return { ...prev, highlights: next };
                        })
                      }
                    />
                  </div>
                  <div className="w-full flex-[2] space-y-2">
                    <Label>Description</Label>
                    <Input
                      placeholder="Short description..."
                      value={highlight.description}
                      onChange={(event) =>
                        setForm((prev) => {
                          const next = [...prev.highlights];
                          next[index] = { ...next[index], description: event.target.value };
                          return { ...prev, highlights: next };
                        })
                      }
                    />
                  </div>
                  <div className="mt-8 flex-shrink-0">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          highlights: prev.highlights.filter((_, idx) => idx !== index)
                        }))
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="w-full border-dashed"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    highlights: [...prev.highlights, { title: '', description: '' }]
                  }))
                }
              >
                <Plus className="mr-2 h-4 w-4" /> Add Highlight
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end border-t bg-muted/50 py-4">
        <Button
          form="landing-form"
          type="submit"
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Landing Page
        </Button>
      </CardFooter>
    </Card>
  );
}

function AboutSection() {
  const queryClient = useQueryClient();
  const aboutQuery = useQuery({
    queryKey: ['content', 'about'],
    queryFn: getAbout
  });

  const [form, setForm] = useState<AboutContent>({
    heading: '',
    description: '',
    showTeam: false,
    teamMembers: []
  });

  useEffect(() => {
    const data = aboutQuery.data as AboutContent | undefined;
    if (data) {
      setForm({
        heading: data.heading ?? '',
        description: data.description ?? '',
        showTeam: data.showTeam ?? false,
        teamMembers: data.teamMembers ?? []
      });
    }
  }, [aboutQuery.data]);

  const updateMutation = useMutation({
    mutationFn: updateAbout,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['content', 'about'] })
  });

  return (
    <Card className="border-none bg-gradient-to-br from-card to-muted/10 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Info className="h-6 w-6 text-primary" /> About Us Content
        </CardTitle>
        <CardDescription>Update the about heading, description, and your team members.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="about-form"
          className="max-w-4xl space-y-8"
          onSubmit={(event) => {
            event.preventDefault();
            updateMutation.mutate(form);
          }}
        >
          <div className="space-y-4">
            <h3 className="border-b pb-2 text-lg font-semibold">Company Info</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="heading">About Heading</Label>
                <Input
                  id="heading"
                  placeholder="Our Story"
                  value={form.heading}
                  onChange={(event) => setForm((prev) => ({ ...prev, heading: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">About Description</Label>
                <Textarea
                  id="description"
                  placeholder="We are a company that..."
                  rows={5}
                  value={form.description}
                  onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                />
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="showTeam"
                  checked={Boolean(form.showTeam)}
                  onCheckedChange={(checked) => setForm((prev) => ({ ...prev, showTeam: checked }))}
                />
                <Label htmlFor="showTeam" className="cursor-pointer">Display Team Section</Label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="border-b pb-2 text-lg font-semibold">Team Members</h3>
            <div className="space-y-4">
              {form.teamMembers?.map((member, index) => (
                <div key={`${member.name}-${index}`} className="flex flex-col items-start gap-4 rounded-lg border bg-muted/30 p-4 md:flex-row">
                  <div className="w-full flex-1 space-y-2">
                    <Label>Name</Label>
                    <Input
                      placeholder="Jane Doe"
                      value={member.name}
                      onChange={(event) =>
                        setForm((prev) => {
                          const next = [...(prev.teamMembers ?? [])];
                          next[index] = { ...next[index], name: event.target.value };
                          return { ...prev, teamMembers: next };
                        })
                      }
                    />
                  </div>
                  <div className="w-full flex-1 space-y-2">
                    <Label>Role</Label>
                    <Input
                      placeholder="CTO"
                      value={member.role ?? ''}
                      onChange={(event) =>
                        setForm((prev) => {
                          const next = [...(prev.teamMembers ?? [])];
                          next[index] = { ...next[index], role: event.target.value };
                          return { ...prev, teamMembers: next };
                        })
                      }
                    />
                  </div>
                  <div className="w-full flex-[1.5]">
                    <MediaAssetPicker
                      label={`Team member ${index + 1} image`}
                      value={member.imageUrl ?? ''}
                      onChange={(url) =>
                        setForm((prev) => {
                          const next = [...(prev.teamMembers ?? [])];
                          next[index] = { ...next[index], imageUrl: url };
                          return { ...prev, teamMembers: next };
                        })
                      }
                      helperText="Use a saved image or upload a fresh avatar."
                    />
                  </div>
                  <div className="mt-8 flex-shrink-0">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          teamMembers: prev.teamMembers?.filter((_, idx) => idx !== index)
                        }))
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="w-full border-dashed"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    teamMembers: [...(prev.teamMembers ?? []), { name: '', role: '', imageUrl: '' }]
                  }))
                }
              >
                <Plus className="mr-2 h-4 w-4" /> Add Team Member
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end border-t bg-muted/50 py-4">
        <Button
          form="about-form"
          type="submit"
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save About Content
        </Button>
      </CardFooter>
    </Card>
  );
}

function ContactSection() {
  const queryClient = useQueryClient();
  const contactQuery = useQuery({
    queryKey: ['content', 'contact'],
    queryFn: getContact
  });

  const [form, setForm] = useState<ContactContent>({
    address: '',
    phone: '',
    email: '',
    introText: ''
  });

  useEffect(() => {
    const data = contactQuery.data as ContactContent | undefined;
    if (data) {
      setForm({
        address: data.address ?? '',
        phone: data.phone ?? '',
        email: data.email ?? '',
        introText: data.introText ?? ''
      });
    }
  }, [contactQuery.data]);

  const updateMutation = useMutation({
    mutationFn: updateContact,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['content', 'contact'] })
  });

  return (
    <Card className="border-none bg-gradient-to-br from-card to-muted/10 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Mail className="h-6 w-6 text-primary" /> Contact Content
        </CardTitle>
        <CardDescription>Update your contact information shown on the public site.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="contact-form"
          className="max-w-2xl space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            updateMutation.mutate(form);
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="contactAddress">Office Address</Label>
            <Input
              id="contactAddress"
              placeholder="123 Main St, City, Country"
              value={form.address ?? ''}
              onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Phone Number</Label>
              <Input
                id="contactPhone"
                placeholder="+1 555-0123"
                value={form.phone ?? ''}
                onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="hello@company.com"
                value={form.email ?? ''}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactIntroText">Introductory Text</Label>
            <Textarea
              id="contactIntroText"
              placeholder="We'd love to hear from you."
              rows={3}
              value={form.introText ?? ''}
              onChange={(event) => setForm((prev) => ({ ...prev, introText: event.target.value }))}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end border-t bg-muted/50 py-4">
        <Button
          form="contact-form"
          type="submit"
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Contact
        </Button>
      </CardFooter>
    </Card>
  );
}

function ServicesSection() {
  const queryClient = useQueryClient();
  const servicesQuery = useQuery({
    queryKey: ['content', 'services'],
    queryFn: listServices
  });

  const [form, setForm] = useState<ServiceItem>({
    title: '',
    description: '',
    imageUrl: '',
    priceLabel: '',
    isActive: true
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', 'services'] });
      setForm({ title: '', description: '', imageUrl: '', priceLabel: '', isActive: true });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ServiceItem }) => updateService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', 'services'] });
      setEditingId(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteService,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['content', 'services'] })
  });

  const services = (servicesQuery.data as ServiceItem[] | undefined) ?? [];

  return (
    <Card className="border-none bg-gradient-to-br from-card to-muted/10 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Briefcase className="h-6 w-6 text-primary" /> Services Content
        </CardTitle>
        <CardDescription>Manage the services you offer. You can add, edit, active, or delete them.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-8 lg:grid-cols-[1fr,1.5fr]">
          <div>
            <h3 className="mb-4 text-lg font-semibold">{editingId ? 'Edit Service' : 'Add New Service'}</h3>
            <form
              id="services-form"
              className="space-y-4 rounded-xl border bg-muted/30 p-4"
              onSubmit={(event) => {
                event.preventDefault();
                if (editingId) {
                  updateMutation.mutate({ id: editingId, data: form });
                } else {
                  createMutation.mutate(form);
                }
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="serviceTitle">Title</Label>
                <Input
                  id="serviceTitle"
                  placeholder="E.g. Web Development"
                  value={form.title}
                  onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serviceDesc">Short description</Label>
                <Textarea
                  id="serviceDesc"
                  placeholder="We build fast websites..."
                  rows={3}
                  value={form.description ?? ''}
                  onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                />
              </div>
              <MediaAssetPicker
                label="Service image"
                value={form.imageUrl ?? ''}
                onChange={(url) => setForm((prev) => ({ ...prev, imageUrl: url }))}
                helperText="Choose a service thumbnail from the media library or upload a new one."
              />
              <div className="space-y-2">
                <Label htmlFor="servicePrice">Price Label</Label>
                <Input
                  id="servicePrice"
                  placeholder="E.g. From $999"
                  value={form.priceLabel ?? ''}
                  onChange={(event) => setForm((prev) => ({ ...prev, priceLabel: event.target.value }))}
                />
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="serviceActive"
                  checked={Boolean(form.isActive)}
                  onCheckedChange={(checked) => setForm((prev) => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="serviceActive" className="cursor-pointer">Active</Label>
              </div>

              <div className="flex items-center gap-2 pt-4">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : editingId ? <Save className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                  {editingId ? 'Update Service' : 'Add Service'}
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingId(null);
                      setForm({ title: '', description: '', imageUrl: '', priceLabel: '', isActive: true });
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Existing Services</h3>
            <div className="max-h-[600px] space-y-3 overflow-y-auto pr-2 custom-scrollbar">
              {services.map((service) => (
                <div key={service._id} className="group relative rounded-xl border bg-background p-4 transition-all hover:border-primary/50 hover:shadow-md">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <div className="text-lg font-semibold">{service.title}</div>
                      <div className="text-sm font-medium text-primary">{service.priceLabel}</div>
                    </div>
                    {service.isActive ? (
                      <Badge variant="default" className="border-emerald-200 bg-emerald-500/10 text-emerald-600 shadow-none hover:bg-emerald-500/20">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </div>
                  <div className="mb-4 text-sm text-muted-foreground line-clamp-2">{service.description}</div>

                  <Separator className="my-3" />

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingId(service._id ?? null);
                        setForm({
                          title: service.title ?? '',
                          description: service.description ?? '',
                          imageUrl: service.imageUrl ?? '',
                          priceLabel: service.priceLabel ?? '',
                          isActive: service.isActive ?? true
                        });
                      }}
                    >
                      <Edit2 className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => service._id && deleteMutation.mutate(service._id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
              {services.length === 0 && (
                <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
                  No services found. Add one on the left.
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function BlogSection() {
  const queryClient = useQueryClient();
  const blogQuery = useQuery({
    queryKey: ['content', 'blog'],
    queryFn: listBlogPosts
  });

  const [form, setForm] = useState<BlogPost>({
    title: '',
    slug: '',
    excerpt: '',
    body: '',
    coverImageUrl: '',
    publishedAt: '',
    isPublished: false
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: createBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', 'blog'] });
      setForm({ title: '', slug: '', excerpt: '', body: '', coverImageUrl: '', publishedAt: '', isPublished: false });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: BlogPost }) => updateBlogPost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', 'blog'] });
      setEditingId(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBlogPost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['content', 'blog'] })
  });

  const posts = (blogQuery.data as BlogPost[] | undefined) ?? [];

  return (
    <Card className="border-none bg-gradient-to-br from-card to-muted/10 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <FileText className="h-6 w-6 text-primary" /> Blog Posts
        </CardTitle>
        <CardDescription>Manage your blog articles and their publication status.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-8 lg:grid-cols-[1fr,1.5fr]">
          <div>
            <h3 className="mb-4 text-lg font-semibold">{editingId ? 'Edit Blog Post' : 'Add New Post'}</h3>
            <form
              id="blog-form"
              className="space-y-4 rounded-xl border bg-muted/30 p-4"
              onSubmit={(event) => {
                event.preventDefault();
                if (editingId) {
                  updateMutation.mutate({ id: editingId, data: form });
                } else {
                  createMutation.mutate(form);
                }
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="postTitle">Title</Label>
                <Input
                  id="postTitle"
                  placeholder="Introducing our new service..."
                  value={form.title}
                  onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postSlug">Slug</Label>
                <Input
                  id="postSlug"
                  placeholder="new-service"
                  value={form.slug}
                  onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  placeholder="A short summary..."
                  rows={2}
                  value={form.excerpt ?? ''}
                  onChange={(event) => setForm((prev) => ({ ...prev, excerpt: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="body">Body</Label>
                <Textarea
                  id="body"
                  placeholder="Full article content..."
                  rows={6}
                  value={form.body ?? ''}
                  onChange={(event) => setForm((prev) => ({ ...prev, body: event.target.value }))}
                />
              </div>
              <MediaAssetPicker
                label="Blog cover image"
                value={form.coverImageUrl ?? ''}
                onChange={(url) => setForm((prev) => ({ ...prev, coverImageUrl: url }))}
                helperText="Select a cover image that matches the article."
              />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="publishedAt">Published At</Label>
                  <Input
                    id="publishedAt"
                    placeholder="2025-01-01"
                    value={form.publishedAt ?? ''}
                    onChange={(event) => setForm((prev) => ({ ...prev, publishedAt: event.target.value }))}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-8">
                  <Switch
                    id="isPublished"
                    checked={Boolean(form.isPublished)}
                    onCheckedChange={(checked) => setForm((prev) => ({ ...prev, isPublished: checked }))}
                  />
                  <Label htmlFor="isPublished" className="cursor-pointer">Published</Label>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : editingId ? <Save className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                  {editingId ? 'Update Post' : 'Add Post'}
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingId(null);
                      setForm({ title: '', slug: '', excerpt: '', body: '', coverImageUrl: '', publishedAt: '', isPublished: false });
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Existing Posts</h3>
            <div className="max-h-[700px] space-y-3 overflow-y-auto pr-2 custom-scrollbar">
              {posts.map((post) => (
                <div key={post._id} className="group relative rounded-xl border bg-background p-4 transition-all hover:border-primary/50 hover:shadow-md">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <div className="text-lg font-semibold">{post.title}</div>
                      <div className="text-sm text-muted-foreground">{post.slug}</div>
                    </div>
                    {post.isPublished ? (
                      <Badge variant="default" className="bg-emerald-500/10 text-emerald-600 shadow-none hover:bg-emerald-500/20">Published</Badge>
                    ) : (
                      <Badge variant="secondary">Draft</Badge>
                    )}
                  </div>
                  <div className="mb-4 text-sm text-muted-foreground line-clamp-3">{post.excerpt}</div>

                  <Separator className="my-3" />

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingId(post._id ?? null);
                        setForm({
                          title: post.title ?? '',
                          slug: post.slug ?? '',
                          excerpt: post.excerpt ?? '',
                          body: post.body ?? '',
                          coverImageUrl: post.coverImageUrl ?? '',
                          publishedAt: post.publishedAt ?? '',
                          isPublished: post.isPublished ?? false
                        });
                      }}
                    >
                      <Edit2 className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => post._id && deleteMutation.mutate(post._id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
              {posts.length === 0 && (
                <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
                  No posts found. Add one on the left.
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
