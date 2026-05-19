// src/types/api.types.ts
// Tipos TypeScript para la API de ContractIA

import {
  ApiDocumentCompanyContractRequest,
  ApiDocumentLaborContractResponse,
  ApiDocumentServiceItemResponse,
} from './api/apiDocument';
import {
  ApiDocumentFormData,
  ApiDocumentState,
  ApiDocumentType,
  ApiUserRole,
} from './api/shared';

export interface User {
  id: number;
  organization_id: number;
  supabase_user_id?: string | null;
  email: string;
  role: ApiUserRole;
  full_name?: string | null;
  avatar_url?: string | null;
  receives_notifications?: boolean;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export type OrganizationMember = User;

export interface DocumentFolder {
  id: number;
  organization_id: number;
  name: string;
  owner_role: ApiUserRole;
  created_by: number;
  created_by_name?: string | null;
  created_by_email?: string | null;
  documents_count: number;
  created_at: string;
  updated_at: string;
}

export interface DocumentFlatten {
  id: number;
  name: string;
  type?: ApiDocumentType;
  contract_type: ApiDocumentType;
  client: string;
  start_date: string;
  end_date: string;
  form_data: ApiDocumentFormData;
  state: ApiDocumentState;
  service_items: ApiDocumentServiceItemResponse[];
  folder_id?: number | null;
  file_path?: string | null;
  file_name?: string | null;
  company_contract?: ApiDocumentCompanyContractRequest;
  labor_contract?: ApiDocumentLaborContractResponse;
  created_at: string;
  updated_at: string;
}

// ============================================
// NOTIFICATION TYPES
// ============================================
