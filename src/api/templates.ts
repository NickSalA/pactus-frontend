import type {
  ApiDocumentResponse,
  ApiTemplateFormatResponse,
  ApiTemplateGenerateRequest,
  ApiTemplatePersistedDraftResponse,
  ApiTemplatePreviewRequest,
  ApiTemplatePreviewResponse,
  ApiTemplateResponse,
  ApiTemplateState,
  ApiDocumentType,
  ApiTemplateCreateRequest,
  ApiTemplateUpdateRequest,
} from "@/types/api";
import type { ApiDocumentServiceItemRequest } from "@/types/api";
import { TIMEOUTS } from "./constants";
import { apiGet, apiPost, apiPatch } from "./axiosInstance";

export type TemplateListFilters = {
  documentType?: ApiDocumentType;
  formatCode?: string;
  state?: ApiTemplateState;
};

export interface TemplateGenerateContractRequest extends Record<string, unknown> {
  cliente_nombre?: string;
  folder_id?: number | null;
  service_items?: ApiDocumentServiceItemRequest[];
  trabajador_nombre?: string;
}

export interface WorkerContractFormData extends TemplateGenerateContractRequest {
  trabajador_nombre: string;
  trabajador_dni: string;
  trabajador_domicilio: string;
  trabajador_actividades: string;
  forma_contratacion: string;
  modalidad_y_causas_contratacion: string;
  contrato_duracion: string;
  contrato_fecha_inicio: string;
  contrato_fecha_fin: string;
  remuneracion_monto: string;
  remuneracion_periodicidad: string;
  horario_dias: string;
  horario_horas: string;
  refrigerio_duracion: string;
  refrigerio_inicio: string;
  refrigerio_fin: string;
  dia_firma: string;
  mes_firma: string;
  anio_firma: string;
}

const buildQueryString = (params: Record<string, string | null | undefined>): string => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      query.set(key, value);
    }
  });

  const serialized = query.toString();
  return serialized ? `?${serialized}` : "";
};

const normalizeDraftRequest = (request: ApiTemplateGenerateRequest): ApiTemplateGenerateRequest => {
  return Object.fromEntries(
    Object.entries(request).filter(([, value]) => {
      if (value == null) {
        return false;
      }

      return typeof value !== "string" || value.trim() !== "";
    })
  ) as ApiTemplateGenerateRequest;
};

export async function getTemplates(filters: TemplateListFilters = {}): Promise<ApiTemplateResponse[]> {
  const query = buildQueryString({
    document_type: filters.documentType,
    format_code: filters.formatCode,
    state: filters.state,
  });

  return apiGet<ApiTemplateResponse[]>(`/templates/${query}`, {
    timeout: TIMEOUTS.DEFAULT,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function getTemplateFormats(documentType?: ApiDocumentType): Promise<ApiTemplateFormatResponse[]> {
  const query = buildQueryString({ document_type: documentType });
  return apiGet<ApiTemplateFormatResponse[]>(`/templates/formats${query}`, {
    timeout: TIMEOUTS.DEFAULT,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function getTemplateById(templateId: number): Promise<ApiTemplateResponse> {
  return apiGet<ApiTemplateResponse>(`/templates/${templateId}`, {
    timeout: TIMEOUTS.DEFAULT,
  });
}

export async function createTemplate(payload: ApiTemplateCreateRequest): Promise<ApiTemplateResponse> {
  return apiPost<ApiTemplateResponse>("/templates/", payload, {
    timeout: TIMEOUTS.AUTH,
  });
}

export async function updateTemplate(
  templateId: number,
  payload: ApiTemplateUpdateRequest
): Promise<ApiTemplateResponse> {
  return apiPatch<ApiTemplateResponse>(`/templates/${templateId}`, payload, {
    timeout: TIMEOUTS.AUTH,
  });
}

export async function publishTemplate(templateId: number): Promise<ApiTemplateResponse> {
  return apiPost<ApiTemplateResponse>(`/templates/${templateId}/publish`, undefined, {
    timeout: TIMEOUTS.AUTH,
  });
}

export async function archiveTemplate(templateId: number): Promise<ApiTemplateResponse> {
  return apiPost<ApiTemplateResponse>(`/templates/${templateId}/archive`, undefined, {
    timeout: TIMEOUTS.AUTH,
  });
}

export async function previewTemplate(payload: ApiTemplatePreviewRequest): Promise<ApiTemplatePreviewResponse> {
  return apiPost<ApiTemplatePreviewResponse>("/templates/preview", payload, {
    timeout: TIMEOUTS.AUTH,
  });
}

export async function generateTemplateDraft(
  request: ApiTemplateGenerateRequest,
  file?: File | null
): Promise<ApiTemplatePersistedDraftResponse> {
  const normalizedRequest = normalizeDraftRequest(request);

  if (!normalizedRequest.format_code?.trim()) {
    throw new Error("Debes seleccionar un formato.");
  }

  const formData = new FormData();
  formData.append("request", JSON.stringify(normalizedRequest));

  if (file) {
    formData.append("file", file);
  }

  return apiPost<ApiTemplatePersistedDraftResponse>("/templates/drafts", formData, {
    timeout: TIMEOUTS.UPLOAD,
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function generateContractFromTemplate(
  templateId: number,
  data: TemplateGenerateContractRequest
): Promise<ApiDocumentResponse> {
  return apiPost<ApiDocumentResponse>(`/templates/${templateId}/generate`, data, {
    timeout: TIMEOUTS.UPLOAD,
  });
}