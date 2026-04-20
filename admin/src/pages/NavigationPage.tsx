import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowDown, ArrowUp, LayoutTemplate, Link2, Loader2, Plus, Save, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  getNavigation,
  updateNavigation,
  type FooterSection,
  type NavigationConfig,
  type NavigationItem,
  type PageKey
} from '@/lib/api';

const pageOptions: { value: PageKey; label: string }[] = [
  { value: 'landing', label: 'Home' },
  { value: 'about', label: 'About' },
  { value: 'services', label: 'Services' },
  { value: 'blog', label: 'Blog' },
  { value: 'contact', label: 'Contact' }
];

const defaultNavigation: NavigationConfig = {
  header: [],
  footer: [],
  copyright: ''
};

const emptyNavItem = (): NavigationItem => ({
  label: '',
  pageKey: 'landing',
  url: '',
  newTab: false,
  children: []
});

const emptyFooterSection = (): FooterSection => ({
  title: '',
  links: [emptyNavItem()]
});

const moveItem = <T,>(items: T[], index: number, direction: -1 | 1): T[] => {
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= items.length) {
    return items;
  }

  const copy = [...items];
  const [item] = copy.splice(index, 1);
  copy.splice(nextIndex, 0, item);
  return copy;
};

function NavigationItemEditor({
  item,
  title,
  onChange,
  onMoveUp,
  onMoveDown,
  onRemove,
  disableMoveUp,
  disableMoveDown
}: {
  item: NavigationItem;
  title: string;
  onChange: (value: NavigationItem) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  disableMoveUp: boolean;
  disableMoveDown: boolean;
}) {
  return (
    <div className="rounded-xl border bg-background p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">{title}</h3>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="icon" onClick={onMoveUp} disabled={disableMoveUp}>
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button type="button" variant="outline" size="icon" onClick={onMoveDown} disabled={disableMoveDown}>
            <ArrowDown className="h-4 w-4" />
          </Button>
          <Button type="button" variant="destructive" size="icon" onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Label</Label>
          <Input
            value={item.label}
            onChange={(event) => onChange({ ...item, label: event.target.value })}
            placeholder="Menu label"
          />
        </div>
        <div className="space-y-2">
          <Label>Linked Page</Label>
          <Select
            value={item.pageKey ?? 'custom'}
            onValueChange={(value) =>
              onChange({
                ...item,
                pageKey: value === 'custom' ? undefined : (value as PageKey)
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a page" />
            </SelectTrigger>
            <SelectContent>
              {pageOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
              <SelectItem value="custom">Custom URL</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>External URL</Label>
          <Input
            value={item.url ?? ''}
            onChange={(event) => onChange({ ...item, url: event.target.value })}
            placeholder="https://example.com or /contact"
          />
        </div>
        <div className="flex items-center gap-3 pt-2">
          <Switch checked={Boolean(item.newTab)} onCheckedChange={(checked) => onChange({ ...item, newTab: checked })} />
          <Label>Open in new tab</Label>
        </div>
      </div>
    </div>
  );
}

export function NavigationPage() {
  const queryClient = useQueryClient();
  const navigationQuery = useQuery({
    queryKey: ['content', 'navigation'],
    queryFn: getNavigation
  });

  const [form, setForm] = useState<NavigationConfig>(defaultNavigation);

  useEffect(() => {
    if (navigationQuery.data) {
      const data = navigationQuery.data as NavigationConfig;
      setForm({
        header: data.header ?? [],
        footer: data.footer ?? [],
        copyright: data.copyright ?? ''
      });
    }
  }, [navigationQuery.data]);

  const saveMutation = useMutation({
    mutationFn: updateNavigation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', 'navigation'] });
    }
  });

  return (
    <Card className="border-none bg-gradient-to-br from-card to-muted/10 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <LayoutTemplate className="h-6 w-6 text-primary" /> Header & Footer Navigation
        </CardTitle>
        <CardDescription>
          Manage global header links, footer sections, and their sequence. Use the arrow controls to rearrange items.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="navigation-form"
          className="space-y-8"
          onSubmit={(event) => {
            event.preventDefault();
            saveMutation.mutate(form);
          }}
        >
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-4 border-b pb-2">
              <div>
                <h2 className="text-lg font-semibold">Header Menu</h2>
                <p className="text-sm text-muted-foreground">These links appear in the top navigation across the site.</p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setForm((prev) => ({ ...prev, header: [...prev.header, emptyNavItem()] }))}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Header Link
              </Button>
            </div>

            <div className="space-y-3">
              {form.header.map((item, index) => (
                <NavigationItemEditor
                  key={`header-${index}`}
                  title={`Header Link ${index + 1}`}
                  item={item}
                  disableMoveUp={index === 0}
                  disableMoveDown={index === form.header.length - 1}
                  onMoveUp={() =>
                    setForm((prev) => ({
                      ...prev,
                      header: moveItem(prev.header, index, -1)
                    }))
                  }
                  onMoveDown={() =>
                    setForm((prev) => ({
                      ...prev,
                      header: moveItem(prev.header, index, 1)
                    }))
                  }
                  onRemove={() =>
                    setForm((prev) => ({
                      ...prev,
                      header: prev.header.filter((_, itemIndex) => itemIndex !== index)
                    }))
                  }
                  onChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      header: prev.header.map((existing, itemIndex) => (itemIndex === index ? value : existing))
                    }))
                  }
                />
              ))}
              {form.header.length === 0 ? (
                <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
                  No header links yet. Add the first item to build your top navigation.
                </div>
              ) : null}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between gap-4 border-b pb-2">
              <div>
                <h2 className="text-lg font-semibold">Footer Sections</h2>
                <p className="text-sm text-muted-foreground">Group footer links into columns and reorder sections when needed.</p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setForm((prev) => ({ ...prev, footer: [...prev.footer, emptyFooterSection()] }))}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Footer Section
              </Button>
            </div>

            <div className="space-y-4">
              {form.footer.map((section, sectionIndex) => (
                <div key={`footer-section-${sectionIndex}`} className="rounded-2xl border bg-background p-5">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <Label>Section Title</Label>
                      <Input
                        value={section.title}
                        onChange={(event) =>
                          setForm((prev) => ({
                            ...prev,
                            footer: prev.footer.map((existing, index) =>
                              index === sectionIndex ? { ...existing, title: event.target.value } : existing
                            )
                          }))
                        }
                        placeholder="Company"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-6">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            footer: moveItem(prev.footer, sectionIndex, -1)
                          }))
                        }
                        disabled={sectionIndex === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            footer: moveItem(prev.footer, sectionIndex, 1)
                          }))
                        }
                        disabled={sectionIndex === form.footer.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            footer: prev.footer.filter((_, index) => index !== sectionIndex)
                          }))
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {section.links.map((link, linkIndex) => (
                      <NavigationItemEditor
                        key={`footer-link-${sectionIndex}-${linkIndex}`}
                        title={`Footer Link ${linkIndex + 1}`}
                        item={link}
                        disableMoveUp={linkIndex === 0}
                        disableMoveDown={linkIndex === section.links.length - 1}
                        onMoveUp={() =>
                          setForm((prev) => ({
                            ...prev,
                            footer: prev.footer.map((existing, index) =>
                              index === sectionIndex
                                ? { ...existing, links: moveItem(existing.links, linkIndex, -1) }
                                : existing
                            )
                          }))
                        }
                        onMoveDown={() =>
                          setForm((prev) => ({
                            ...prev,
                            footer: prev.footer.map((existing, index) =>
                              index === sectionIndex
                                ? { ...existing, links: moveItem(existing.links, linkIndex, 1) }
                                : existing
                            )
                          }))
                        }
                        onRemove={() =>
                          setForm((prev) => ({
                            ...prev,
                            footer: prev.footer.map((existing, index) =>
                              index === sectionIndex
                                ? { ...existing, links: existing.links.filter((_, index) => index !== linkIndex) }
                                : existing
                            )
                          }))
                        }
                        onChange={(value) =>
                          setForm((prev) => ({
                            ...prev,
                            footer: prev.footer.map((existing, index) =>
                              index === sectionIndex
                                ? {
                                    ...existing,
                                    links: existing.links.map((currentLink, index) =>
                                      index === linkIndex ? value : currentLink
                                    )
                                  }
                                : existing
                            )
                          }))
                        }
                      />
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-dashed"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          footer: prev.footer.map((existing, index) =>
                            index === sectionIndex
                              ? { ...existing, links: [...existing.links, emptyNavItem()] }
                              : existing
                          )
                        }))
                      }
                    >
                      <Link2 className="mr-2 h-4 w-4" />
                      Add Footer Link
                    </Button>
                  </div>
                </div>
              ))}
              {form.footer.length === 0 ? (
                <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
                  No footer sections yet. Add a section to organize your footer links.
                </div>
              ) : null}
            </div>
          </section>

          <section className="space-y-2">
            <Label htmlFor="copyright">Copyright Text</Label>
            <Textarea
              id="copyright"
              rows={2}
              value={form.copyright ?? ''}
              onChange={(event) => setForm((prev) => ({ ...prev, copyright: event.target.value }))}
              placeholder="(c) 2026 Acme Studio. All rights reserved."
            />
          </section>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end border-t bg-muted/50 py-4">
        <Button form="navigation-form" type="submit" disabled={saveMutation.isPending}>
          {saveMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Navigation
        </Button>
      </CardFooter>
    </Card>
  );
}
