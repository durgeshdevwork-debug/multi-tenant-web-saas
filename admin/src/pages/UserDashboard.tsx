import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getLanding,
  updateLanding,
  getAbout,
  updateAbout,
  getContact,
  updateContact,
  listServices,
  createService,
  updateService,
  deleteService,
  listBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  type AboutContent,
  type BlogPost,
  type ContactContent,
  type LandingContent,
  type ServiceItem
} from '@/lib/api';

const tabs = ['landing', 'about', 'services', 'blog', 'contact'] as const;
type Tab = (typeof tabs)[number];

export function UserDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('landing');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`rounded-full border px-4 py-1 text-sm ${activeTab === tab ? 'border-black bg-black text-white' : 'bg-white'}`}
            onClick={() => setActiveTab(tab)}
            type="button"
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {activeTab === 'landing' ? <LandingSection /> : null}
      {activeTab === 'about' ? <AboutSection /> : null}
      {activeTab === 'services' ? <ServicesSection /> : null}
      {activeTab === 'blog' ? <BlogSection /> : null}
      {activeTab === 'contact' ? <ContactSection /> : null}
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
    if (landingQuery.data) {
      setForm({
        heroTitle: landingQuery.data.heroTitle ?? '',
        heroSubtitle: landingQuery.data.heroSubtitle ?? '',
        heroImageUrl: landingQuery.data.heroImageUrl ?? '',
        primaryCtaText: landingQuery.data.primaryCtaText ?? '',
        primaryCtaUrl: landingQuery.data.primaryCtaUrl ?? '',
        highlights: landingQuery.data.highlights ?? []
      });
    }
  }, [landingQuery.data]);

  const updateMutation = useMutation({
    mutationFn: updateLanding,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['content', 'landing'] })
  });

  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Landing Content</h2>
      <form
        className="mt-4 space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          updateMutation.mutate(form);
        }}
      >
        <input
          className="w-full rounded-md border px-3 py-2 text-sm"
          placeholder="Hero title"
          value={form.heroTitle}
          onChange={(event) => setForm((prev) => ({ ...prev, heroTitle: event.target.value }))}
        />
        <input
          className="w-full rounded-md border px-3 py-2 text-sm"
          placeholder="Hero subtitle"
          value={form.heroSubtitle ?? ''}
          onChange={(event) => setForm((prev) => ({ ...prev, heroSubtitle: event.target.value }))}
        />
        <input
          className="w-full rounded-md border px-3 py-2 text-sm"
          placeholder="Hero image URL"
          value={form.heroImageUrl ?? ''}
          onChange={(event) => setForm((prev) => ({ ...prev, heroImageUrl: event.target.value }))}
        />
        <div className="grid gap-3 md:grid-cols-2">
          <input
            className="rounded-md border px-3 py-2 text-sm"
            placeholder="Primary CTA text"
            value={form.primaryCtaText ?? ''}
            onChange={(event) => setForm((prev) => ({ ...prev, primaryCtaText: event.target.value }))}
          />
          <input
            className="rounded-md border px-3 py-2 text-sm"
            placeholder="Primary CTA URL"
            value={form.primaryCtaUrl ?? ''}
            onChange={(event) => setForm((prev) => ({ ...prev, primaryCtaUrl: event.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Highlights</div>
          {form.highlights.map((highlight, index) => (
            <div key={`${highlight.title}-${index}`} className="grid gap-2 md:grid-cols-[2fr,3fr,auto]">
              <input
                className="rounded-md border px-3 py-2 text-sm"
                placeholder="Title"
                value={highlight.title}
                onChange={(event) =>
                  setForm((prev) => {
                    const next = [...prev.highlights];
                    next[index] = { ...next[index], title: event.target.value };
                    return { ...prev, highlights: next };
                  })
                }
              />
              <input
                className="rounded-md border px-3 py-2 text-sm"
                placeholder="Description"
                value={highlight.description}
                onChange={(event) =>
                  setForm((prev) => {
                    const next = [...prev.highlights];
                    next[index] = { ...next[index], description: event.target.value };
                    return { ...prev, highlights: next };
                  })
                }
              />
              <button
                type="button"
                className="rounded-md border px-3 py-2 text-xs"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    highlights: prev.highlights.filter((_, idx) => idx !== index)
                  }))
                }
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="rounded-md border px-3 py-2 text-xs"
            onClick={() =>
              setForm((prev) => ({
                ...prev,
                highlights: [...prev.highlights, { title: '', description: '' }]
              }))
            }
          >
            Add highlight
          </button>
        </div>

        <button
          type="submit"
          className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90"
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? 'Saving...' : 'Save Landing'}
        </button>
      </form>
    </section>
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
    if (aboutQuery.data) {
      setForm({
        heading: aboutQuery.data.heading ?? '',
        description: aboutQuery.data.description ?? '',
        showTeam: aboutQuery.data.showTeam ?? false,
        teamMembers: aboutQuery.data.teamMembers ?? []
      });
    }
  }, [aboutQuery.data]);

  const updateMutation = useMutation({
    mutationFn: updateAbout,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['content', 'about'] })
  });

  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">About Content</h2>
      <form
        className="mt-4 space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          updateMutation.mutate(form);
        }}
      >
        <input
          className="w-full rounded-md border px-3 py-2 text-sm"
          placeholder="Heading"
          value={form.heading}
          onChange={(event) => setForm((prev) => ({ ...prev, heading: event.target.value }))}
        />
        <textarea
          className="w-full rounded-md border px-3 py-2 text-sm"
          placeholder="Description"
          rows={4}
          value={form.description}
          onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={Boolean(form.showTeam)}
            onChange={(event) => setForm((prev) => ({ ...prev, showTeam: event.target.checked }))}
          />
          Show team section
        </label>

        <div className="space-y-2">
          <div className="text-sm font-medium">Team Members</div>
          {form.teamMembers?.map((member, index) => (
            <div key={`${member.name}-${index}`} className="grid gap-2 md:grid-cols-[2fr,2fr,2fr,auto]">
              <input
                className="rounded-md border px-3 py-2 text-sm"
                placeholder="Name"
                value={member.name}
                onChange={(event) =>
                  setForm((prev) => {
                    const next = [...(prev.teamMembers ?? [])];
                    next[index] = { ...next[index], name: event.target.value };
                    return { ...prev, teamMembers: next };
                  })
                }
              />
              <input
                className="rounded-md border px-3 py-2 text-sm"
                placeholder="Role"
                value={member.role ?? ''}
                onChange={(event) =>
                  setForm((prev) => {
                    const next = [...(prev.teamMembers ?? [])];
                    next[index] = { ...next[index], role: event.target.value };
                    return { ...prev, teamMembers: next };
                  })
                }
              />
              <input
                className="rounded-md border px-3 py-2 text-sm"
                placeholder="Image URL"
                value={member.imageUrl ?? ''}
                onChange={(event) =>
                  setForm((prev) => {
                    const next = [...(prev.teamMembers ?? [])];
                    next[index] = { ...next[index], imageUrl: event.target.value };
                    return { ...prev, teamMembers: next };
                  })
                }
              />
              <button
                type="button"
                className="rounded-md border px-3 py-2 text-xs"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    teamMembers: prev.teamMembers?.filter((_, idx) => idx !== index)
                  }))
                }
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="rounded-md border px-3 py-2 text-xs"
            onClick={() =>
              setForm((prev) => ({
                ...prev,
                teamMembers: [...(prev.teamMembers ?? []), { name: '', role: '', imageUrl: '' }]
              }))
            }
          >
            Add team member
          </button>
        </div>

        <button
          type="submit"
          className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90"
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? 'Saving...' : 'Save About'}
        </button>
      </form>
    </section>
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
    if (contactQuery.data) {
      setForm({
        address: contactQuery.data.address ?? '',
        phone: contactQuery.data.phone ?? '',
        email: contactQuery.data.email ?? '',
        introText: contactQuery.data.introText ?? ''
      });
    }
  }, [contactQuery.data]);

  const updateMutation = useMutation({
    mutationFn: updateContact,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['content', 'contact'] })
  });

  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Contact Content</h2>
      <form
        className="mt-4 space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          updateMutation.mutate(form);
        }}
      >
        <input
          className="w-full rounded-md border px-3 py-2 text-sm"
          placeholder="Address"
          value={form.address ?? ''}
          onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
        />
        <input
          className="w-full rounded-md border px-3 py-2 text-sm"
          placeholder="Phone"
          value={form.phone ?? ''}
          onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
        />
        <input
          className="w-full rounded-md border px-3 py-2 text-sm"
          placeholder="Email"
          value={form.email ?? ''}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
        />
        <textarea
          className="w-full rounded-md border px-3 py-2 text-sm"
          placeholder="Intro text"
          rows={3}
          value={form.introText ?? ''}
          onChange={(event) => setForm((prev) => ({ ...prev, introText: event.target.value }))}
        />
        <button
          type="submit"
          className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90"
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? 'Saving...' : 'Save Contact'}
        </button>
      </form>
    </section>
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
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Services</h2>

      <form
        className="mt-4 grid gap-3 md:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          if (editingId) {
            updateMutation.mutate({ id: editingId, data: form });
          } else {
            createMutation.mutate(form);
          }
        }}
      >
        <input
          className="rounded-md border px-3 py-2 text-sm"
          placeholder="Title"
          value={form.title}
          onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
          required
        />
        <input
          className="rounded-md border px-3 py-2 text-sm"
          placeholder="Short description"
          value={form.description ?? ''}
          onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
        />
        <input
          className="rounded-md border px-3 py-2 text-sm"
          placeholder="Image URL"
          value={form.imageUrl ?? ''}
          onChange={(event) => setForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
        />
        <input
          className="rounded-md border px-3 py-2 text-sm"
          placeholder="Price label"
          value={form.priceLabel ?? ''}
          onChange={(event) => setForm((prev) => ({ ...prev, priceLabel: event.target.value }))}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={Boolean(form.isActive)}
            onChange={(event) => setForm((prev) => ({ ...prev, isActive: event.target.checked }))}
          />
          Active
        </label>
        <button
          type="submit"
          className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90"
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {editingId ? 'Update Service' : 'Add Service'}
        </button>
      </form>

      <div className="mt-4 space-y-3">
        {services.map((service) => (
          <div key={service._id} className="rounded-lg border px-3 py-2 text-sm">
            <div className="font-semibold">{service.title}</div>
            <div className="text-muted-foreground">{service.description}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-md border px-3 py-1 text-xs"
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
                Edit
              </button>
              <button
                type="button"
                className="rounded-md border px-3 py-1 text-xs"
                onClick={() => service._id && deleteMutation.mutate(service._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
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
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Blog Posts</h2>
      <form
        className="mt-4 grid gap-3 md:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          if (editingId) {
            updateMutation.mutate({ id: editingId, data: form });
          } else {
            createMutation.mutate(form);
          }
        }}
      >
        <input
          className="rounded-md border px-3 py-2 text-sm"
          placeholder="Title"
          value={form.title}
          onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
          required
        />
        <input
          className="rounded-md border px-3 py-2 text-sm"
          placeholder="Slug"
          value={form.slug}
          onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
          required
        />
        <textarea
          className="rounded-md border px-3 py-2 text-sm md:col-span-2"
          placeholder="Excerpt"
          rows={2}
          value={form.excerpt ?? ''}
          onChange={(event) => setForm((prev) => ({ ...prev, excerpt: event.target.value }))}
        />
        <textarea
          className="rounded-md border px-3 py-2 text-sm md:col-span-2"
          placeholder="Body"
          rows={4}
          value={form.body ?? ''}
          onChange={(event) => setForm((prev) => ({ ...prev, body: event.target.value }))}
        />
        <input
          className="rounded-md border px-3 py-2 text-sm"
          placeholder="Cover image URL"
          value={form.coverImageUrl ?? ''}
          onChange={(event) => setForm((prev) => ({ ...prev, coverImageUrl: event.target.value }))}
        />
        <input
          className="rounded-md border px-3 py-2 text-sm"
          placeholder="Published at (ISO)"
          value={form.publishedAt ?? ''}
          onChange={(event) => setForm((prev) => ({ ...prev, publishedAt: event.target.value }))}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={Boolean(form.isPublished)}
            onChange={(event) => setForm((prev) => ({ ...prev, isPublished: event.target.checked }))}
          />
          Published
        </label>
        <button
          type="submit"
          className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90"
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {editingId ? 'Update Post' : 'Add Post'}
        </button>
      </form>

      <div className="mt-4 space-y-3">
        {posts.map((post) => (
          <div key={post._id} className="rounded-lg border px-3 py-2 text-sm">
            <div className="font-semibold">{post.title}</div>
            <div className="text-muted-foreground">{post.slug}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-md border px-3 py-1 text-xs"
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
                Edit
              </button>
              <button
                type="button"
                className="rounded-md border px-3 py-1 text-xs"
                onClick={() => post._id && deleteMutation.mutate(post._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
