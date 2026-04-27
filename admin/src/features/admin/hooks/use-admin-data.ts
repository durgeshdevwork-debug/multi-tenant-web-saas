import { useQuery } from "@tanstack/react-query"
import { getClients } from "../services/clients.api"
import { getTemplates } from "../services/templates.api"

export function useAdminClientsQuery() {
  return useQuery({
    queryKey: ["admin", "clients"],
    queryFn: getClients,
  })
}

export function useAdminTemplatesQuery() {
  return useQuery({
    queryKey: ["admin", "templates"],
    queryFn: getTemplates,
  })
}

