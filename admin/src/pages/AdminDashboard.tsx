import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createClient,
  createTemplate,
  getClient,
  getClients,
  getTemplates,
  regenerateApiKey,
  updateClient,
  type Template,
  type Tenant
} from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Loader2, Plus, RefreshCw, Save, FileText, Users, Building } from 'lucide-react';

const defaultModules = ['landing', 'about', 'services', 'blog', 'contact'];

export function AdminDashboard() {
  const queryClient = useQueryClient();
  const [templateForm, setTemplateForm] = useState({ name: '', identifier: '', modules: defaultModules.join(', ') });
  const [clientForm, setClientForm] = useState({
    clientName: '',
    slug: '',
    primaryDomain: '',
    templateId: '',
    businessName: '',
    businessAddress: '',
    businessPhone: '',
    email: '',
    password: ''
  });
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [lastApiKey, setLastApiKey] = useState<string | null>(null);

  const templatesQuery = useQuery({
    queryKey: ['templates'],
    queryFn: getTemplates
  });

  const clientsQuery = useQuery({
    queryKey: ['clients'],
    queryFn: getClients
  });

  const selectedClientQuery = useQuery({
    queryKey: ['client', selectedClientId],
    queryFn: () => getClient(selectedClientId as string),
    enabled: Boolean(selectedClientId)
  });

  const createTemplateMutation = useMutation({
    mutationFn: createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      setTemplateForm({ name: '', identifier: '', modules: defaultModules.join(', ') });
    }
  });

  const createClientMutation = useMutation({
    mutationFn: createClient,
    onSuccess: (payload: any) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setLastApiKey(payload?.apiKey ?? null);
      setClientForm({
        clientName: '',
        slug: '',
        primaryDomain: '',
        templateId: '',
        businessName: '',
        businessAddress: '',
        businessPhone: '',
        email: '',
        password: ''
      });
    }
  });

  const updateClientMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Tenant> }) => updateClient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      if (selectedClientId) {
        queryClient.invalidateQueries({ queryKey: ['client', selectedClientId] });
      }
    }
  });

  const refreshKeyMutation = useMutation({
    mutationFn: regenerateApiKey,
    onSuccess: (payload: any) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setLastApiKey(payload?.apiKey ?? null);
    }
  });

  const selectedClient = selectedClientQuery.data as Tenant | undefined;
  const selectedClientForm = useMemo(() => {
    if (!selectedClient) return null;
    return {
      name: selectedClient.name ?? '',
      slug: selectedClient.slug ?? '',
      primaryDomain: selectedClient.primaryDomain ?? '',
      status: selectedClient.status ?? 'pending',
      businessName: selectedClient.businessDetails?.name ?? '',
      businessAddress: selectedClient.businessDetails?.address ?? '',
      businessPhone: selectedClient.businessDetails?.phone ?? ''
    };
  }, [selectedClient]);

  const [clientDetailForm, setClientDetailForm] = useState(selectedClientForm);

  useEffect(() => {
    if (selectedClientForm && selectedClientQuery.isSuccess) {
      setClientDetailForm(selectedClientForm);
    }
  }, [selectedClientForm, selectedClientQuery.isSuccess]);

  const handleTemplateSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createTemplateMutation.mutate({
      name: templateForm.name,
      identifier: templateForm.identifier,
      modules: templateForm.modules.split(',').map((m) => m.trim()).filter(Boolean)
    });
  };

  const handleClientSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createClientMutation.mutate({
      clientName: clientForm.clientName,
      slug: clientForm.slug,
      primaryDomain: clientForm.primaryDomain || undefined,
      templateId: clientForm.templateId,
      businessDetails: {
        name: clientForm.businessName || undefined,
        address: clientForm.businessAddress || undefined,
        phone: clientForm.businessPhone || undefined
      },
      email: clientForm.email,
      password: clientForm.password
    });
  };

  const handleClientUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedClientId || !clientDetailForm) return;
    updateClientMutation.mutate({
      id: selectedClientId,
      data: {
        name: clientDetailForm.name,
        slug: clientDetailForm.slug,
        primaryDomain: clientDetailForm.primaryDomain || undefined,
        status: clientDetailForm.status as Tenant['status'],
        businessDetails: {
          name: clientDetailForm.businessName || undefined,
          address: clientDetailForm.businessAddress || undefined,
          phone: clientDetailForm.businessPhone || undefined
        }
      }
    });
  };

  return (
    <div className="container mx-auto p-8 max-w-7xl animate-in fade-in zoom-in-95 duration-500">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-2">Admin Dashboard</h1>
          <p className="text-lg text-muted-foreground">Manage your tenants, clients, and platform templates.</p>
        </div>
      </div>

      <Tabs defaultValue="clients" className="space-y-6">
        <TabsList className="bg-muted p-1 rounded-lg">
          <TabsTrigger value="clients" className="rounded-md flex items-center gap-2 px-6">
            <Users className="h-4 w-4" /> Clients
          </TabsTrigger>
          <TabsTrigger value="onboard" className="rounded-md flex items-center gap-2 px-6">
            <Plus className="h-4 w-4" /> Onboard
          </TabsTrigger>
          <TabsTrigger value="templates" className="rounded-md flex items-center gap-2 px-6">
            <FileText className="h-4 w-4" /> Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clients" className="mt-0">
          <Card className="border-none shadow-xl bg-gradient-to-br from-card to-muted/20">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Building className="h-6 w-6 text-primary" /> Manage Clients
              </CardTitle>
              <CardDescription>View and update existing tenants on the platform.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 lg:grid-cols-[1fr,2fr]">
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {(clientsQuery.data as Tenant[] | undefined)?.map((client) => (
                    <div
                      key={client._id}
                      className={`group relative cursor-pointer overflow-hidden rounded-xl border p-4 transition-all hover:shadow-md ${selectedClientId === client._id ? 'border-primary ring-1 ring-primary bg-primary/5' : 'bg-background hover:border-primary/50'}`}
                      onClick={() => setSelectedClientId(client._id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-lg">{client.name}</div>
                        <Badge variant={client.status === 'active' ? 'default' : client.status === 'pending' ? 'secondary' : 'destructive'} className="capitalize">
                          {client.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground grid grid-cols-1 gap-1">
                        <span className="truncate">Key: <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded">{client.truncatedApiKey ?? 'N/A'}</span></span>
                        <span className="truncate">Domain: {client.primaryDomain ?? client.slug}</span>
                      </div>
                    </div>
                  ))}
                  {(clientsQuery.data as Tenant[] | undefined)?.length === 0 && (
                    <div className="text-center p-8 border border-dashed rounded-xl text-muted-foreground">
                      No clients found.
                    </div>
                  )}
                </div>

                <div className="rounded-xl border bg-background/50 backdrop-blur shadow-sm overflow-hidden h-fit">
                  {!selectedClientId ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground h-full min-h-[400px]">
                      <Users className="h-12 w-12 mb-4 opacity-20" />
                      <p className="text-lg">Select a client from the list to view and edit details.</p>
                    </div>
                  ) : selectedClientQuery.isLoading ? (
                    <div className="flex items-center justify-center p-12 h-full min-h-[400px]">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : selectedClient && clientDetailForm ? (
                    <form onSubmit={handleClientUpdate}>
                      <div className="p-6 space-y-6">
                        <div className="flex items-center justify-between border-b pb-4">
                          <h3 className="text-xl font-bold">{selectedClient.name}</h3>
                          <Badge variant="outline" className="font-mono">{selectedClient._id}</Badge>
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="edit-name">Client Name</Label>
                            <Input
                              id="edit-name"
                              value={clientDetailForm.name}
                              onChange={(event) => setClientDetailForm((prev) => prev && ({ ...prev, name: event.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-slug">Slug</Label>
                            <Input
                              id="edit-slug"
                              value={clientDetailForm.slug}
                              onChange={(event) => setClientDetailForm((prev) => prev && ({ ...prev, slug: event.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-domain">Primary Domain</Label>
                            <Input
                              id="edit-domain"
                              value={clientDetailForm.primaryDomain}
                              onChange={(event) => setClientDetailForm((prev) => prev && ({ ...prev, primaryDomain: event.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-status">Status</Label>
                            <Select
                              value={clientDetailForm.status}
                              onValueChange={(value) => setClientDetailForm((prev) => prev && ({ ...prev, status: value as any }))}
                            >
                              <SelectTrigger id="edit-status">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <Separator />
                        
                        <div>
                          <h4 className="font-semibold mb-4">Business Details</h4>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor="edit-biz-name">Business Name</Label>
                              <Input
                                id="edit-biz-name"
                                placeholder="E.g. Acme Corp"
                                value={clientDetailForm.businessName}
                                onChange={(event) => setClientDetailForm((prev) => prev && ({ ...prev, businessName: event.target.value }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-biz-address">Business Address</Label>
                              <Input
                                id="edit-biz-address"
                                placeholder="123 Main St"
                                value={clientDetailForm.businessAddress}
                                onChange={(event) => setClientDetailForm((prev) => prev && ({ ...prev, businessAddress: event.target.value }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-biz-phone">Business Phone</Label>
                              <Input
                                id="edit-biz-phone"
                                placeholder="+1 555-0000"
                                value={clientDetailForm.businessPhone}
                                onChange={(event) => setClientDetailForm((prev) => prev && ({ ...prev, businessPhone: event.target.value }))}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-muted/50 p-6 flex flex-wrap gap-4 items-center justify-between border-t mt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => refreshKeyMutation.mutate(selectedClient._id)}
                          disabled={refreshKeyMutation.isPending}
                        >
                          {refreshKeyMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                          Regenerate API Key
                        </Button>
                        <Button
                          type="submit"
                          disabled={updateClientMutation.isPending}
                        >
                          {updateClientMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex items-center justify-center p-12 text-muted-foreground h-full min-h-[400px]">Client not found.</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="onboard" className="mt-0">
          <Card className="border-none shadow-xl bg-gradient-to-br from-card to-muted/20">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Plus className="h-6 w-6 text-primary" /> Onboard New Client
              </CardTitle>
              <CardDescription>Create a new tenant and user account on the platform.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleClientSubmit} className="space-y-8 max-w-4xl">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Tenant Details</h3>
                    <div className="space-y-2">
                      <Label htmlFor="clientName">Client Name <span className="text-destructive">*</span></Label>
                      <Input
                        id="clientName"
                        placeholder="John Doe"
                        value={clientForm.clientName}
                        onChange={(event) => setClientForm((prev) => ({ ...prev, clientName: event.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug (Unique) <span className="text-destructive">*</span></Label>
                      <Input
                        id="slug"
                        placeholder="john-doe-inc"
                        value={clientForm.slug}
                        onChange={(event) => setClientForm((prev) => ({ ...prev, slug: event.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="primaryDomain">Primary Domain</Label>
                      <Input
                        id="primaryDomain"
                        placeholder="johndoe.com"
                        value={clientForm.primaryDomain}
                        onChange={(event) => setClientForm((prev) => ({ ...prev, primaryDomain: event.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="templateId">Template <span className="text-destructive">*</span></Label>
                      <Select
                        value={clientForm.templateId}
                        onValueChange={(value) => setClientForm((prev) => ({ ...prev, templateId: value }))}
                        required
                      >
                        <SelectTrigger id="templateId">
                          <SelectValue placeholder="Select a template" />
                        </SelectTrigger>
                        <SelectContent>
                          {(templatesQuery.data as Template[] | undefined)?.map((template) => (
                            <SelectItem key={template._id} value={template._id!}>
                              {template.name} ({template.identifier})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">User Credentials & Business</h3>
                    <div className="space-y-2">
                      <Label htmlFor="email">User Email <span className="text-destructive">*</span></Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@johndoe.com"
                        value={clientForm.email}
                        onChange={(event) => setClientForm((prev) => ({ ...prev, email: event.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Temporary Password <span className="text-destructive">*</span></Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={clientForm.password}
                        onChange={(event) => setClientForm((prev) => ({ ...prev, password: event.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input
                        id="businessName"
                        placeholder="John Doe Inc."
                        value={clientForm.businessName}
                        onChange={(event) => setClientForm((prev) => ({ ...prev, businessName: event.target.value }))}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label htmlFor="businessPhone">Phone</Label>
                        <Input
                          id="businessPhone"
                          placeholder="+1 555-0123"
                          value={clientForm.businessPhone}
                          onChange={(event) => setClientForm((prev) => ({ ...prev, businessPhone: event.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="businessAddress">Address</Label>
                        <Input
                          id="businessAddress"
                          placeholder="City, Country"
                          value={clientForm.businessAddress}
                          onChange={(event) => setClientForm((prev) => ({ ...prev, businessAddress: event.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {lastApiKey && (
                  <div className="rounded-lg border border-emerald-500/50 bg-emerald-500/10 p-4 text-emerald-900 dark:text-emerald-200">
                    <div className="font-semibold flex items-center gap-2 mb-1">
                      Client Created Successfully
                    </div>
                    <div>
                      New API key: <code className="bg-background px-2 py-1 rounded font-mono text-sm shadow-sm">{lastApiKey}</code>
                    </div>
                  </div>
                )}

                <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={createClientMutation.isPending}>
                  {createClientMutation.isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Plus className="mr-2 h-5 w-5" />}
                  Create Client
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="mt-0">
          <Card className="border-none shadow-xl bg-gradient-to-br from-card to-muted/20">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" /> Platform Templates
              </CardTitle>
              <CardDescription>Seed or manage template definitions used during client onboarding.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTemplateSubmit} className="mb-10 bg-background/50 p-6 rounded-xl border shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Create New Template</h3>
                <div className="grid gap-4 md:grid-cols-3 items-end">
                  <div className="space-y-2">
                    <Label htmlFor="template-name">Template Name</Label>
                    <Input
                      id="template-name"
                      placeholder="E.g. Professional Services"
                      value={templateForm.name}
                      onChange={(event) => setTemplateForm((prev) => ({ ...prev, name: event.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template-identifier">Identifier</Label>
                    <Input
                      id="template-identifier"
                      placeholder="E.g. business_basic"
                      value={templateForm.identifier}
                      onChange={(event) => setTemplateForm((prev) => ({ ...prev, identifier: event.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template-modules">Modules</Label>
                    <Input
                      id="template-modules"
                      placeholder="landing, about, services"
                      value={templateForm.modules}
                      onChange={(event) => setTemplateForm((prev) => ({ ...prev, modules: event.target.value }))}
                    />
                  </div>
                </div>
                <Button type="submit" className="mt-4" disabled={createTemplateMutation.isPending}>
                  {createTemplateMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                  Create Template
                </Button>
              </form>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {(templatesQuery.data as Template[] | undefined)?.map((template) => (
                  <Card key={template._id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="bg-muted/30 pb-4">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription className="font-mono text-xs">{template.identifier}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-3">Included Modules</h4>
                      <div className="flex flex-wrap gap-2">
                        {template.modules?.map((module) => (
                          <Badge key={module} variant="secondary" className="font-normal capitalize shadow-sm">
                            {module}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
