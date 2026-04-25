import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, Loader2 } from "lucide-react"
import { createClient, getTemplates, type Template } from "@/lib/api"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function OnboardTab() {
  const queryClient = useQueryClient()
  const [lastApiKey, setLastApiKey] = useState<string | null>(null)
  const [clientForm, setClientForm] = useState({
    clientName: "",
    slug: "",
    primaryDomain: "",
    templateId: "",
    businessName: "",
    businessAddress: "",
    businessPhone: "",
    email: "",
    password: "",
  })

  const templatesQuery = useQuery({
    queryKey: ["templates"],
    queryFn: getTemplates,
  })

  const createClientMutation = useMutation({
    mutationFn: createClient,
    onSuccess: (payload: any) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] })
      setLastApiKey(payload?.apiKey ?? null)
      setClientForm({
        clientName: "",
        slug: "",
        primaryDomain: "",
        templateId: "",
        businessName: "",
        businessAddress: "",
        businessPhone: "",
        email: "",
        password: "",
      })
    },
  })

  const handleClientSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    createClientMutation.mutate({
      clientName: clientForm.clientName,
      slug: clientForm.slug,
      primaryDomain: clientForm.primaryDomain || undefined,
      templateId: clientForm.templateId,
      businessDetails: {
        name: clientForm.businessName || undefined,
        address: clientForm.businessAddress || undefined,
        phone: clientForm.businessPhone || undefined,
      },
      email: clientForm.email,
      password: clientForm.password,
    })
  }

  return (
    <Card className="border-none bg-gradient-to-br from-card to-muted/20 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Plus className="h-6 w-6 text-primary" /> Onboard New Client
        </CardTitle>
        <CardDescription>
          Create a new tenant and user account on the platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleClientSubmit} className="max-w-4xl space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="border-b pb-2 text-lg font-semibold">Tenant Details</h3>
              <div className="space-y-2">
                <Label htmlFor="clientName">
                  Client Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="clientName"
                  placeholder="John Doe"
                  value={clientForm.clientName}
                  onChange={(event) =>
                    setClientForm((prev) => ({
                      ...prev,
                      clientName: event.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">
                  Slug (Unique) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="slug"
                  placeholder="john-doe-inc"
                  value={clientForm.slug}
                  onChange={(event) =>
                    setClientForm((prev) => ({
                      ...prev,
                      slug: event.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="primaryDomain">Primary Domain</Label>
                <Input
                  id="primaryDomain"
                  placeholder="johndoe.com"
                  value={clientForm.primaryDomain}
                  onChange={(event) =>
                    setClientForm((prev) => ({
                      ...prev,
                      primaryDomain: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="templateId">
                  Template <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={clientForm.templateId}
                  onValueChange={(value) =>
                    setClientForm((prev) => ({
                      ...prev,
                      templateId: value,
                    }))
                  }
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
              <h3 className="border-b pb-2 text-lg font-semibold">
                User Credentials & Business
              </h3>
              <div className="space-y-2">
                <Label htmlFor="email">
                  User Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@johndoe.com"
                  value={clientForm.email}
                  onChange={(event) =>
                    setClientForm((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">
                  Temporary Password <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={clientForm.password}
                  onChange={(event) =>
                    setClientForm((prev) => ({
                      ...prev,
                      password: event.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  placeholder="John Doe Inc."
                  value={clientForm.businessName}
                  onChange={(event) =>
                    setClientForm((prev) => ({
                      ...prev,
                      businessName: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="businessPhone">Phone</Label>
                  <Input
                    id="businessPhone"
                    placeholder="+1 555-0123"
                    value={clientForm.businessPhone}
                    onChange={(event) =>
                      setClientForm((prev) => ({
                        ...prev,
                        businessPhone: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessAddress">Address</Label>
                  <Input
                    id="businessAddress"
                    placeholder="City, Country"
                    value={clientForm.businessAddress}
                    onChange={(event) =>
                      setClientForm((prev) => ({
                        ...prev,
                        businessAddress: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {lastApiKey && (
            <div className="rounded-lg border border-emerald-500/50 bg-emerald-500/10 p-4 text-emerald-900 dark:text-emerald-200">
              <div className="mb-1 flex items-center gap-2 font-semibold">
                Client Created Successfully
              </div>
              <div>
                New API key:{" "}
                <code className="rounded bg-background px-2 py-1 font-mono text-sm shadow-sm">
                  {lastApiKey}
                </code>
              </div>
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full sm:w-auto"
            disabled={createClientMutation.isPending}
          >
            {createClientMutation.isPending ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Plus className="mr-2 h-5 w-5" />
            )}
            Create Client
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
