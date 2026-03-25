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
    <div className="space-y-10">
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Templates</h2>
        <p className="text-sm text-muted-foreground">Seed or manage template definitions.</p>

        <form className="mt-4 grid gap-3 md:grid-cols-3" onSubmit={handleTemplateSubmit}>
          <input
            className="rounded-md border px-3 py-2 text-sm"
            placeholder="Template name"
            value={templateForm.name}
            onChange={(event) => setTemplateForm((prev) => ({ ...prev, name: event.target.value }))}
            required
          />
          <input
            className="rounded-md border px-3 py-2 text-sm"
            placeholder="Identifier (e.g., business_basic)"
            value={templateForm.identifier}
            onChange={(event) => setTemplateForm((prev) => ({ ...prev, identifier: event.target.value }))}
            required
          />
          <input
            className="rounded-md border px-3 py-2 text-sm md:col-span-2"
            placeholder="Modules (comma-separated)"
            value={templateForm.modules}
            onChange={(event) => setTemplateForm((prev) => ({ ...prev, modules: event.target.value }))}
          />
          <button
            type="submit"
            className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90"
            disabled={createTemplateMutation.isPending}
          >
            {createTemplateMutation.isPending ? 'Saving...' : 'Create Template'}
          </button>
        </form>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {(templatesQuery.data as Template[] | undefined)?.map((template) => (
            <div key={template._id} className="rounded-lg border p-3 text-sm">
              <div className="font-semibold">{template.name}</div>
              <div className="text-muted-foreground">{template.identifier}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {template.modules?.map((module) => (
                  <span key={module} className="rounded-full border px-2 py-0.5 text-xs">
                    {module}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Create Client</h2>
        <p className="text-sm text-muted-foreground">Onboard a new tenant and user.</p>

        <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={handleClientSubmit}>
          <input
            className="rounded-md border px-3 py-2 text-sm"
            placeholder="Client name"
            value={clientForm.clientName}
            onChange={(event) => setClientForm((prev) => ({ ...prev, clientName: event.target.value }))}
            required
          />
          <input
            className="rounded-md border px-3 py-2 text-sm"
            placeholder="Slug (unique)"
            value={clientForm.slug}
            onChange={(event) => setClientForm((prev) => ({ ...prev, slug: event.target.value }))}
            required
          />
          <input
            className="rounded-md border px-3 py-2 text-sm"
            placeholder="Primary domain (optional)"
            value={clientForm.primaryDomain}
            onChange={(event) => setClientForm((prev) => ({ ...prev, primaryDomain: event.target.value }))}
          />
          <select
            className="rounded-md border px-3 py-2 text-sm"
            value={clientForm.templateId}
            onChange={(event) => setClientForm((prev) => ({ ...prev, templateId: event.target.value }))}
            required
          >
            <option value="">Select template</option>
            {(templatesQuery.data as Template[] | undefined)?.map((template) => (
              <option key={template._id} value={template._id}>
                {template.name}
              </option>
            ))}
          </select>
          <input
            className="rounded-md border px-3 py-2 text-sm"
            placeholder="Business name"
            value={clientForm.businessName}
            onChange={(event) => setClientForm((prev) => ({ ...prev, businessName: event.target.value }))}
          />
          <input
            className="rounded-md border px-3 py-2 text-sm"
            placeholder="Business address"
            value={clientForm.businessAddress}
            onChange={(event) => setClientForm((prev) => ({ ...prev, businessAddress: event.target.value }))}
          />
          <input
            className="rounded-md border px-3 py-2 text-sm"
            placeholder="Business phone"
            value={clientForm.businessPhone}
            onChange={(event) => setClientForm((prev) => ({ ...prev, businessPhone: event.target.value }))}
          />
          <input
            className="rounded-md border px-3 py-2 text-sm"
            placeholder="User email"
            value={clientForm.email}
            onChange={(event) => setClientForm((prev) => ({ ...prev, email: event.target.value }))}
            required
          />
          <input
            className="rounded-md border px-3 py-2 text-sm"
            placeholder="Temporary password"
            value={clientForm.password}
            onChange={(event) => setClientForm((prev) => ({ ...prev, password: event.target.value }))}
            required
          />
          <button
            type="submit"
            className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90"
            disabled={createClientMutation.isPending}
          >
            {createClientMutation.isPending ? 'Creating...' : 'Create Client'}
          </button>
        </form>

        {lastApiKey ? (
          <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            New API key: <span className="font-mono">{lastApiKey}</span>
          </div>
        ) : null}
      </section>

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Clients</h2>
        <p className="text-sm text-muted-foreground">Manage existing tenants.</p>

        <div className="mt-4 grid gap-4 lg:grid-cols-[2fr,3fr]">
          <div className="space-y-3">
            {(clientsQuery.data as Tenant[] | undefined)?.map((client) => (
              <button
                key={client._id}
                className={`w-full rounded-lg border px-3 py-2 text-left text-sm ${selectedClientId === client._id ? 'border-black' : ''}`}
                onClick={() => setSelectedClientId(client._id)}
                type="button"
              >
                <div className="font-semibold">{client.name}</div>
                <div className="text-muted-foreground">Status: {client.status}</div>
                <div className="text-muted-foreground">API Key: {client.truncatedApiKey ?? 'N/A'}</div>
              </button>
            ))}
          </div>

          <div className="rounded-lg border p-4">
            {!selectedClientId ? (
              <div className="text-sm text-muted-foreground">Select a client to view details.</div>
            ) : selectedClientQuery.isLoading ? (
              <div className="text-sm">Loading client...</div>
            ) : selectedClient && clientDetailForm ? (
              <form className="grid gap-3 md:grid-cols-2" onSubmit={handleClientUpdate}>
                <input
                  className="rounded-md border px-3 py-2 text-sm"
                  value={clientDetailForm.name}
                  onChange={(event) => setClientDetailForm((prev) => prev && ({ ...prev, name: event.target.value }))}
                />
                <input
                  className="rounded-md border px-3 py-2 text-sm"
                  value={clientDetailForm.slug}
                  onChange={(event) => setClientDetailForm((prev) => prev && ({ ...prev, slug: event.target.value }))}
                />
                <input
                  className="rounded-md border px-3 py-2 text-sm"
                  value={clientDetailForm.primaryDomain}
                  onChange={(event) => setClientDetailForm((prev) => prev && ({ ...prev, primaryDomain: event.target.value }))}
                />
                <select
                  className="rounded-md border px-3 py-2 text-sm"
                  value={clientDetailForm.status}
                  onChange={(event) => setClientDetailForm((prev) => prev && ({ ...prev, status: event.target.value }))}
                >
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                  <option value="pending">pending</option>
                </select>
                <input
                  className="rounded-md border px-3 py-2 text-sm"
                  placeholder="Business name"
                  value={clientDetailForm.businessName}
                  onChange={(event) => setClientDetailForm((prev) => prev && ({ ...prev, businessName: event.target.value }))}
                />
                <input
                  className="rounded-md border px-3 py-2 text-sm"
                  placeholder="Business address"
                  value={clientDetailForm.businessAddress}
                  onChange={(event) => setClientDetailForm((prev) => prev && ({ ...prev, businessAddress: event.target.value }))}
                />
                <input
                  className="rounded-md border px-3 py-2 text-sm"
                  placeholder="Business phone"
                  value={clientDetailForm.businessPhone}
                  onChange={(event) => setClientDetailForm((prev) => prev && ({ ...prev, businessPhone: event.target.value }))}
                />

                <div className="flex flex-wrap gap-2 md:col-span-2">
                  <button
                    type="submit"
                    className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90"
                    disabled={updateClientMutation.isPending}
                  >
                    {updateClientMutation.isPending ? 'Saving...' : 'Update Client'}
                  </button>
                  <button
                    type="button"
                    className="rounded-md border px-4 py-2 text-sm"
                    onClick={() => refreshKeyMutation.mutate(selectedClient._id)}
                    disabled={refreshKeyMutation.isPending}
                  >
                    {refreshKeyMutation.isPending ? 'Regenerating...' : 'Regenerate API Key'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-sm text-muted-foreground">Client not found.</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
