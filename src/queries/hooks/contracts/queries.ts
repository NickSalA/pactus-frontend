import { useQuery } from "@tanstack/react-query";
import { getDocumentById, getDocumentFolders, getDocuments, getDocumentFileUrl, getServices, getServicesAdmin } from "@/api";

const CONTRACTS_KEY = ["contracts"] as const;

export const useDocuments = () =>
  useQuery({
    queryKey: CONTRACTS_KEY,
    queryFn: () => getDocuments(),
  });

export const useDocumentById = (id: number) =>
  useQuery({
    queryKey: [...CONTRACTS_KEY, id] as const,
    queryFn: () => getDocumentById(id),
    enabled: id > 0,
  });

export const useDocumentFolders = () =>
  useQuery({
    queryKey: [...CONTRACTS_KEY, "folders"] as const,
    queryFn: () => getDocumentFolders(),
  });

export const useServices = () =>
  useQuery({
    queryKey: [...CONTRACTS_KEY, "services"] as const,
    queryFn: () => getServices(),
  });

export const useServicesAdmin = (includeInactive: boolean = true) =>
  useQuery({
    queryKey: [...CONTRACTS_KEY, "services-admin", includeInactive] as const,
    queryFn: () => getServicesAdmin(includeInactive),
  });

export const useDocumentFileUrl = (id: number) =>
  useQuery({
    queryKey: [...CONTRACTS_KEY, id, "file-url"] as const,
    queryFn: () => getDocumentFileUrl(id),
    enabled: id > 0,
  });