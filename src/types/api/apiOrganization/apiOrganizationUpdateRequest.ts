export interface ApiOrganizationUpdateRequest {
  name?: string | null;
  is_active?: boolean | null;
  ruc?: string | null;
  address?: string | null;
  company_type?: string | null;
  objeto_social?: string | null;
  legal_rep_name?: string | null;
  legal_rep_dni?: string | null;
  jurisdiction?: string | null;
  city?: string | null;
  autorizacion_entidad?: string | null;
  autorizacion_fecha?: string | null;
  autorizacion_emitida_por?: string | null;
  email?: string | null;
  phone?: string | null;
}
