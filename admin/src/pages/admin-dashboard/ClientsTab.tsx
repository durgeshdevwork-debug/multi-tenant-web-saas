import { useState, useEffect, useMemo } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { Building, Users, Loader2, RefreshCw, Save, Plus } from "lucide-react"
import {
  getClient,
  regenerateApiKey,
  updateClient,
} from "@/features/admin/services/clients.api"
import { useAdminClientsQuery } from "@/features/admin/hooks/use-admin-data"
import type { Tenant, TenantStatus } from "@/features/content/types"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function ClientsTab() {
  const queryClient = useQueryClient()
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)

  const clientsQuery = useAdminClientsQuery()

  const selectedClientQuery = useQuery({
    queryKey: ["admin", "client", selectedClientId],
    queryFn: () => getClient(selectedClientId as string),
    enabled: Boolean(selectedClientId),
  })

  const updateClientMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Tenant> }) =>
      updateClient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "clients"] })
      if (selectedClientId) {
        queryClient.invalidateQueries({
          queryKey: ["admin", "client", selectedClientId],
        })
      }
    },
  })

  const refreshKeyMutation = useMutation({
    mutationFn: regenerateApiKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "clients"] })
      if (selectedClientId) {
        queryClient.invalidateQueries({
          queryKey: ["admin", "client", selectedClientId],
        })
      }
    },
  })

  const selectedClient = selectedClientQuery.data as Tenant | undefined
  const selectedClientForm = useMemo(() => {
    if (!selectedClient) return null
    return {
      name: selectedClient.name ?? "",
      slug: selectedClient.slug ?? "",
      primaryDomain: selectedClient.primaryDomain ?? "",
      status: selectedClient.status ?? "pending",
      businessName: selectedClient.businessDetails?.name ?? "",
      businessAddress: selectedClient.businessDetails?.address ?? "",
      businessPhone: selectedClient.businessDetails?.phone ?? "",
    }
  }, [selectedClient])

  const [clientDetailForm, setClientDetailForm] = useState(selectedClientForm)

  useEffect(() => {
    if (selectedClientForm && selectedClientQuery.isSuccess) {
      setClientDetailForm(selectedClientForm)
    }
  }, [selectedClientForm, selectedClientQuery.isSuccess])

  const handleClientUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedClientId || !clientDetailForm) return
    updateClientMutation.mutate({
      id: selectedClientId,
      data: {
        name: clientDetailForm.name,
        slug: clientDetailForm.slug,
        primaryDomain: clientDetailForm.primaryDomain || undefined,
        status: clientDetailForm.status as Tenant["status"],
        businessDetails: {
          name: clientDetailForm.businessName || undefined,
          address: clientDetailForm.businessAddress || undefined,
          phone: clientDetailForm.businessPhone || undefined,
        },
      },
    })
  }

  return (
    <Card className="border-none bg-gradient-to-br from-card to-muted/20 shadow-xl">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Building className="h-6 w-6 text-primary" /> Manage Clients
            </CardTitle>
            <CardDescription>
              View and update existing tenants on the platform.
            </CardDescription>
          </div>
          <Button asChild variant="outline">
            <Link to="/admin/onboard">
              <Plus className="mr-2 h-4 w-4" />
              Add New Client
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-[1fr,2fr]">
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-3">
            {(clientsQuery.data as Tenant[] | undefined)?.map((client) => (
              <div
                key={client._id}
                className={`group relative cursor-pointer overflow-hidden rounded-xl border p-4 transition-all hover:shadow-md ${
                  selectedClientId === client._id
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "bg-background hover:border-primary/50"
                }`}
                onClick={() => setSelectedClientId(client._id)}
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-lg font-semibold">{client.name}</div>
                  <Badge
                    variant={
                      client.status === "active"
                        ? "default"
                        : client.status === "pending"
                          ? "secondary"
                          : "destructive"
                    }
                    className="capitalize"
                  >
                    {client.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 gap-1 text-sm text-muted-foreground">
                  <span className="truncate">
                    Key:{" "}
                    <span className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                      {client.truncatedApiKey ?? "N/A"}
                    </span>
                  </span>
                  <span className="truncate">
                    Domain: {client.primaryDomain ?? client.slug}
                  </span>
                </div>
              </div>
            ))}
            {(clientsQuery.data as Tenant[] | undefined)?.length === 0 && (
              <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
                No clients found.
              </div>
            )}
            </div>
          </ScrollArea>

          <div className="h-fit overflow-hidden rounded-xl border bg-background/50 shadow-sm backdrop-blur">
            {!selectedClientId ? (
              <div className="flex h-full min-h-[400px] flex-col items-center justify-center p-12 text-center text-muted-foreground">
                <Users className="mb-4 h-12 w-12 opacity-20" />
                <p className="text-lg">
                  Select a client from the list to view and edit details.
                </p>
              </div>
            ) : selectedClientQuery.isLoading ? (
              <div className="flex h-full min-h-[400px] items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : selectedClient && clientDetailForm ? (
              <form onSubmit={handleClientUpdate}>
                <div className="space-y-6 p-6">
                  <div className="flex items-center justify-between border-b pb-4">
                    <h3 className="text-xl font-bold">{selectedClient.name}</h3>
                    <Badge variant="outline" className="font-mono">
                      {selectedClient._id}
                    </Badge>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">Client Name</Label>
                      <Input
                        id="edit-name"
                        value={clientDetailForm.name}
                        onChange={(event) =>
                          setClientDetailForm(
                            (prev) =>
                              prev && {
                                ...prev,
                                name: event.target.value,
                              }
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-slug">Slug</Label>
                      <Input
                        id="edit-slug"
                        value={clientDetailForm.slug}
                        onChange={(event) =>
                          setClientDetailForm(
                            (prev) =>
                              prev && {
                                ...prev,
                                slug: event.target.value,
                              }
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-domain">Primary Domain</Label>
                      <Input
                        id="edit-domain"
                        value={clientDetailForm.primaryDomain}
                        onChange={(event) =>
                          setClientDetailForm(
                            (prev) =>
                              prev && {
                                ...prev,
                                primaryDomain: event.target.value,
                              }
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-status">Status</Label>
                      <Select
                        value={clientDetailForm.status}
                        onValueChange={(value) =>
                          setClientDetailForm(
                            (prev) =>
                              prev && { ...prev, status: value as TenantStatus }
                          )
                        }
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
                    <h4 className="mb-4 font-semibold">Business Details</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="edit-biz-name">Business Name</Label>
                        <Input
                          id="edit-biz-name"
                          placeholder="E.g. Acme Corp"
                          value={clientDetailForm.businessName}
                          onChange={(event) =>
                            setClientDetailForm(
                              (prev) =>
                                prev && {
                                  ...prev,
                                  businessName: event.target.value,
                                }
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-biz-address">Business Address</Label>
                        <Input
                          id="edit-biz-address"
                          placeholder="123 Main St"
                          value={clientDetailForm.businessAddress}
                          onChange={(event) =>
                            setClientDetailForm(
                              (prev) =>
                                prev && {
                                  ...prev,
                                  businessAddress: event.target.value,
                                }
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-biz-phone">Business Phone</Label>
                        <Input
                          id="edit-biz-phone"
                          placeholder="+1 555-0000"
                          value={clientDetailForm.businessPhone}
                          onChange={(event) =>
                            setClientDetailForm(
                              (prev) =>
                                prev && {
                                  ...prev,
                                  businessPhone: event.target.value,
                                }
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t bg-muted/50 p-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => refreshKeyMutation.mutate(selectedClient._id)}
                    disabled={refreshKeyMutation.isPending}
                  >
                    {refreshKeyMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="mr-2 h-4 w-4" />
                    )}
                    Regenerate API Key
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateClientMutation.isPending}
                  >
                    {updateClientMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex min-h-[400px] items-center justify-center p-12 text-muted-foreground">
                Client not found.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
