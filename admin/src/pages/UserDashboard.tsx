import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
import { Loader2, Plus, Trash2, Edit2, LayoutTemplate, Info, Briefcase, FileText, Mail, Save } from 'lucide-react';

const tabs = ['landing', 'about', 'services', 'blog', 'contact'] as const;
type Tab = (typeof tabs)[number];

export function UserDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('landing');

  return (
    <div className="container mx-auto p-8 max-w-6xl animate-in fade-in zoom-in-95 duration-500">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-2">Website Content</h1>
        <p className="text-lg text-muted-foreground">Manage the content, sections, and pages of your public site.</p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Tab)} className="space-y-6">
        <TabsList className="bg-muted p-1 rounded-lg flex flex-wrap h-auto">
          <TabsTrigger value="landing" className="rounded-md flex items-center gap-2 px-6 py-2">
            <LayoutTemplate className="h-4 w-4" /> Landing
          </TabsTrigger>
          <TabsTrigger value="about" className="rounded-md flex items-center gap-2 px-6 py-2">
            <Info className="h-4 w-4" /> About
          </TabsTrigger>
          <TabsTrigger value="services" className="rounded-md flex items-center gap-2 px-6 py-2">
            <Briefcase className="h-4 w-4" /> Services
          </TabsTrigger>
          <TabsTrigger value="blog" className="rounded-md flex items-center gap-2 px-6 py-2">
            <FileText className="h-4 w-4" /> Blog
          </TabsTrigger>
          <TabsTrigger value="contact" className="rounded-md flex items-center gap-2 px-6 py-2">
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
    <Card className="border-none shadow-xl bg-gradient-to-br from-card to-muted/10">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <LayoutTemplate className="h-6 w-6 text-primary" /> Landing Page Settings
        </CardTitle>
        <CardDescription>Configure the main hero banner, text, and bullet point highlights.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="landing-form"
          className="space-y-8 max-w-4xl"
          onSubmit={(event) => {
            event.preventDefault();
            updateMutation.mutate(form);
          }}
        >
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Hero Section</h3>
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
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="heroImageUrl">Hero Image URL</Label>
                <Input
                  id="heroImageUrl"
                  placeholder="https://example.com/image.png"
                  value={form.heroImageUrl ?? ''}
                  onChange={(event) => setForm((prev) => ({ ...prev, heroImageUrl: event.target.value }))}
                />
              </div>
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
            <h3 className="text-lg font-semibold border-b pb-2">Highlights</h3>
            <div className="space-y-4">
              {form.highlights.map((highlight, index) => (
                <div key={`${highlight.title}-${index}`} className="flex flex-col md:flex-row gap-4 items-start p-4 bg-muted/30 rounded-lg border">
                  <div className="flex-1 space-y-2 w-full">
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
                  <div className="flex-[2] space-y-2 w-full">
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
                <Plus className="h-4 w-4 mr-2" /> Add Highlight
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="bg-muted/50 py-4 border-t flex justify-end">
        <Button
          form="landing-form"
          type="submit"
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
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
    <Card className="border-none shadow-xl bg-gradient-to-br from-card to-muted/10">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Info className="h-6 w-6 text-primary" /> About Us Content
        </CardTitle>
        <CardDescription>Update the about heading, description, and your team members.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="about-form"
          className="space-y-8 max-w-4xl"
          onSubmit={(event) => {
            event.preventDefault();
            updateMutation.mutate(form);
          }}
        >
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Company Info</h3>
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
            <h3 className="text-lg font-semibold border-b pb-2">Team Members</h3>
            <div className="space-y-4">
              {form.teamMembers?.map((member, index) => (
                <div key={`${member.name}-${index}`} className="flex flex-col md:flex-row gap-4 items-start p-4 bg-muted/30 rounded-lg border">
                  <div className="flex-1 space-y-2 w-full">
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
                  <div className="flex-1 space-y-2 w-full">
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
                  <div className="flex-1 space-y-2 w-full">
                    <Label>Image URL</Label>
                    <Input
                      placeholder="https://example.com/avatar.png"
                      value={member.imageUrl ?? ''}
                      onChange={(event) =>
                        setForm((prev) => {
                          const next = [...(prev.teamMembers ?? [])];
                          next[index] = { ...next[index], imageUrl: event.target.value };
                          return { ...prev, teamMembers: next };
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
                <Plus className="h-4 w-4 mr-2" /> Add Team Member
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="bg-muted/50 py-4 border-t flex justify-end">
        <Button
          form="about-form"
          type="submit"
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
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
    <Card className="border-none shadow-xl bg-gradient-to-br from-card to-muted/10">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Mail className="h-6 w-6 text-primary" /> Contact Content
        </CardTitle>
        <CardDescription>Update your contact information shown on the public site.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="contact-form"
          className="space-y-6 max-w-2xl"
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
      <CardFooter className="bg-muted/50 py-4 border-t flex justify-end">
        <Button
          form="contact-form"
          type="submit"
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
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
    <Card className="border-none shadow-xl bg-gradient-to-br from-card to-muted/10">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-primary" /> Services Content
        </CardTitle>
        <CardDescription>Manage the services you offer. You can add, edit, active, or delete them.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid lg:grid-cols-[1fr,1.5fr] gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">{editingId ? 'Edit Service' : 'Add New Service'}</h3>
            <form
              id="services-form"
              className="space-y-4 bg-muted/30 p-4 rounded-xl border"
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
              <div className="space-y-2">
                <Label htmlFor="serviceImage">Image URL</Label>
                <Input
                  id="serviceImage"
                  placeholder="https://example.com/icon.png"
                  value={form.imageUrl ?? ''}
                  onChange={(event) => setForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
                />
              </div>
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

              <div className="pt-4 flex items-center gap-2">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : editingId ? <Save className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
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
            <h3 className="text-lg font-semibold mb-4">Existing Services</h3>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {services.map((service) => (
                <div key={service._id} className="group relative rounded-xl border p-4 bg-background transition-all hover:shadow-md hover:border-primary/50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold text-lg">{service.title}</div>
                      <div className="text-sm font-medium text-primary">{service.priceLabel}</div>
                    </div>
                    {service.isActive ? (
                      <Badge variant="default" className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 shadow-none border-emerald-200">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground mb-4 line-clamp-2">{service.description}</div>
                  
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
                      <Edit2 className="h-4 w-4 mr-2" /> Edit
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => service._id && deleteMutation.mutate(service._id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
              {services.length === 0 && (
                <div className="text-center p-8 border border-dashed rounded-xl text-muted-foreground">
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
    <Card className="border-none shadow-xl bg-gradient-to-br from-card to-muted/10">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" /> Blog Posts
        </CardTitle>
        <CardDescription>Publish updates, news, or articles to your public blog.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid lg:grid-cols-[1.5fr,1fr] gap-8">
          <div className="order-2 lg:order-1">
            <h3 className="text-lg font-semibold mb-4">Existing Posts</h3>
            <div className="space-y-3 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
              {posts.map((post) => (
                <div key={post._id} className="group relative rounded-xl border p-4 bg-background transition-all hover:shadow-md hover:border-primary/50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold text-lg">{post.title}</div>
                      <div className="text-xs font-mono text-muted-foreground mt-1 bg-muted inline-block px-1.5 py-0.5 rounded">/{post.slug}</div>
                    </div>
                    {post.isPublished ? (
                      <Badge variant="default" className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 shadow-none border-emerald-200">Published</Badge>
                    ) : (
                      <Badge variant="secondary">Draft</Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground mb-4 line-clamp-2 mt-2">{post.excerpt}</div>
                  
                  <Separator className="my-3" />
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'No date'}
                    </div>
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
                        <Edit2 className="h-4 w-4 mr-2" /> Edit
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => post._id && deleteMutation.mutate(post._id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {posts.length === 0 && (
                <div className="text-center p-8 border border-dashed rounded-xl text-muted-foreground">
                  No blog posts yet. Write your first one!
                </div>
              )}
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="sticky top-4">
              <h3 className="text-lg font-semibold mb-4">{editingId ? 'Edit Post' : 'Write New Post'}</h3>
              <form
                id="blog-form"
                className="space-y-4 bg-muted/30 p-4 rounded-xl border"
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
                    placeholder="E.g. 10 Tips for Success"
                    value={form.title}
                    onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postSlug">Slug</Label>
                  <Input
                    id="postSlug"
                    placeholder="10-tips"
                    value={form.slug}
                    onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postExcerpt">Excerpt</Label>
                  <Textarea
                    id="postExcerpt"
                    placeholder="Short summary..."
                    rows={2}
                    value={form.excerpt ?? ''}
                    onChange={(event) => setForm((prev) => ({ ...prev, excerpt: event.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postBody">Body</Label>
                  <Textarea
                    id="postBody"
                    placeholder="Write your amazing content here..."
                    rows={8}
                    className="font-mono text-sm"
                    value={form.body ?? ''}
                    onChange={(event) => setForm((prev) => ({ ...prev, body: event.target.value }))}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="postImage">Cover Image URL</Label>
                    <Input
                      id="postImage"
                      placeholder="https://example.com/cover.png"
                      value={form.coverImageUrl ?? ''}
                      onChange={(event) => setForm((prev) => ({ ...prev, coverImageUrl: event.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postDate">Published Date</Label>
                    <Input
                      id="postDate"
                      type="date"
                      value={form.publishedAt ? form.publishedAt.split('T')[0] : ''}
                      onChange={(event) => setForm((prev) => ({ ...prev, publishedAt: event.target.value ? new Date(event.target.value).toISOString() : '' }))}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="postPublished"
                    checked={Boolean(form.isPublished)}
                    onCheckedChange={(checked) => setForm((prev) => ({ ...prev, isPublished: checked }))}
                  />
                  <Label htmlFor="postPublished" className="cursor-pointer">Published to public site</Label>
                </div>

                <div className="pt-4 flex items-center gap-2">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : editingId ? <Save className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                    {editingId ? 'Update Post' : 'Publish Post'}
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
