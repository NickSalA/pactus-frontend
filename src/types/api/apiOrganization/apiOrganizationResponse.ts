export interface ApiOrganizationResponse {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  ruc: string | null;
  address: string | null;
  company_type: string | null;
  objeto_social: string | null;
  legal_rep_name: string | null;
  legal_rep_dni: string | null;
  jurisdiction: string | null;
  city: string | null;
  autorizacion_entidad: string | null;
  autorizacion_fecha: string | null;
  autorizacion_emitida_por: string | null;
  email: string | null;
  phone: string | null;
}

export type ApiOrganizationListResponse = ApiOrganizationResponse[];
