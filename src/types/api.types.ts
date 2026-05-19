// src/types/api.types.ts
// Tipos TypeScript para la API de ContractIA

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

// ============================================
// CONVERSATION TYPES
// ============================================
export interface ConversationMessage {
  role: 'user' | 'bot';
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: number;
  title: string;
  created_at: string;
}

export interface ConversationWithContent extends Conversation {
  content: ConversationMessage[];
}

// ============================================
// DOCUMENT TYPES
// ============================================
export type DocumentType = 'COMPANY' | 'LABOR';
export type DocumentState =
  | 'DRAFT'
  | 'PENDING_SIGNATURE'
  | 'ACTIVE'
  | 'EXPIRING_SOON'
  | 'EXPIRED'
  | 'TERMINATED';
export type CurrencyType = 'PEN' | 'USD' | 'EUR';

export interface CompanyContractResponse {
  id: number;
  document_id: number;
  ruc?: string | null;
  client?: string | null;
  created_at: string;
  updated_at: string;
}

export interface LaborContractResponse {
  id: number;
  document_id: number;
  worker_name?: string | null;
  worker_document_number?: string | null;
  position?: string | null;
  salary_value?: number | null;
  salary_currency?: CurrencyType | null;
  salary_periodicity?: string | null;
  contract_modality?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DocumentFormData {
  value?: number;
  currency?: CurrencyType;
  [key: string]: unknown;
}

export interface DocumentServiceItemPayload {
  service_id: number;
  description?: string | null;
  value: number;
  currency: CurrencyType;
  start_date: string;
  end_date: string;
}

export interface DocumentServiceItem extends DocumentServiceItemPayload {
  id: number;
}

export interface ServiceCatalogItem {
  id: number;
  name: string;
  is_active: boolean;
  documents_count: number;
  created_at: string;
  updated_at: string;
}

export interface ServiceCatalogItemCreateRequest {
  name: string;
  is_active?: boolean;
}

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

export interface Document {
  id: number;
  name: string;
  type?: ApiDocumentType;
  contract_type: ApiDocumentType;
  client: string;
  start_date: string;
  end_date: string;
  form_data: ApiDocumentFormData;
  state: ApiDocumentState;
  service_items: DocumentServiceItem[];
  folder_id?: number | null;
  file_path?: string | null;
  file_name?: string | null;
  company_contract?: CompanyContractResponse;
  labor_contract?: LaborContractResponse;
  created_at: string;
  updated_at: string;
}

export interface DocumentCreateRequest {
  file: File;
  contract_type: DocumentType;
  company_contract?: {
    ruc?: string;
    client?: string;
  };
  labor_contract?: {
    worker_name?: string;
    worker_document_number?: string;
    position?: string;
    salary_value?: number;
    salary_currency?: CurrencyType;
    salary_periodicity?: string;
    contract_modality?: string;
  };
  form_data: DocumentFormData;
  state?: DocumentState;
  folder_id?: number | null;
  service_items?: DocumentServiceItemPayload[];
}

export interface DocumentUpdateRequest {
  contract_type?: DocumentType;
  company_contract?: {
    ruc?: string;
    client?: string;
  };
  labor_contract?: {
    worker_name?: string;
    worker_document_number?: string;
    position?: string;
    salary_value?: number;
    salary_currency?: CurrencyType;
    salary_periodicity?: string;
    contract_modality?: string;
  };
  form_data?: DocumentFormData;
  state?: DocumentState;
  folder_id?: number | null;
  service_items?: DocumentServiceItemPayload[];
  file?: File;
}

export interface DocumentFileUrlResponse {
  url: string;
}

// ============================================
// NOTIFICATION TYPES
// ============================================
export type NotificationType = 'critical' | 'warning' | 'info';

export interface Notification {
  id: string; // "contract-{doc_id}-{days}" — stable for localStorage
  document_id: number;
  type: NotificationType;
  title: string;
  description: string;
  days_remaining: number;
}

export interface NotificationRule {
  id: number;
  organization_id: number;
  document_id?: number | null;
  days_before_due: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationRuleCreateRequest {
  document_id?: number | null;
  days_before_due: number;
  is_active?: boolean;
}

export interface NotificationRuleUpdateRequest {
  days_before_due?: number;
  is_active?: boolean;
}

export type TemplateState = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type TemplateFieldType = 'text' | 'number' | 'date' | 'time' | 'boolean';
export type TemplateGenerationMode = 'adaptive' | 'strict';

export interface TemplateField {
  key: string;
  label: string;
  type: TemplateFieldType | (string & {});
  required: boolean;
  placeholder?: string | null;
}

export interface TemplateContractDateMapping {
  start_date_field: string;
  end_date_field: string;
}

export interface TemplateContent {
  body_md: string;
  fields: TemplateField[];
  operational_fields?: TemplateField[];
  version?: string | null;
  contract_date_mapping?: TemplateContractDateMapping | null;
}

export interface Template {
  id: number;
  organization_id: number;
  name: string;
  description?: string | null;
  document_type: DocumentType;
  template_format_id?: number | null;
  format_code?: string | null;
  format_label?: string | null;
  content: TemplateContent;
  created_at?: string | null;
  state: TemplateState;
}

export interface TemplateCreateRequest {
  name?: string | null;
  description?: string | null;
  document_type?: DocumentType | null;
  format_code: string;
  content: TemplateContent;
}

export interface TemplateUpdateRequest {
  name?: string;
  description?: string | null;
  content?: TemplateContent;
}
