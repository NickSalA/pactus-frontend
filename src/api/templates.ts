import type {
  Document,
  DocumentServiceItemPayload,
  DocumentType,
  GenerateTemplateDraftRequest,
  PersistedTemplateDraftResponse,
  Template,
  TemplateCreateRequest,
  TemplateFormatResponse,
  TemplatePreviewRequest,
  TemplatePreviewResponse,
  TemplateState,
  TemplateUpdateRequest,
} from "@/types/api.types";
import { TIMEOUTS } from "./constants";
import { fetchAPI, fetchWithFormData } from "./fetch-client";

export interface TemplateListFilters {
  documentType?: DocumentType;
  formatCode?: string;
  state?: TemplateState;
}

export interface TemplateGenerateContractRequest extends Record<string, unknown> {
  cliente_nombre?: string;
  folder_id?: number | null;
  service_items?: DocumentServiceItemPayload[];
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

const normalizeDraftRequest = (request: GenerateTemplateDraftRequest): GenerateTemplateDraftRequest => {
  return Object.fromEntries(
    Object.entries(request).filter(([, value]) => {
      if (value == null) {
        return false;
      }

      return typeof value !== "string" || value.trim() !== "";
    }),
  ) as GenerateTemplateDraftRequest;
};

export async function getTemplates(filters: TemplateListFilters = {}): Promise<Template[]> {
  const query = buildQueryString({
    document_type: filters.documentType,
    format_code: filters.formatCode,
    state: filters.state,
  });

  return fetchAPI<Template[]>(`/templates/${query}`, { method: "GET", cache: "no-store" }, TIMEOUTS.DEFAULT);
}

export async function getTemplateFormats(documentType?: DocumentType): Promise<TemplateFormatResponse[]> {
  const query = buildQueryString({ document_type: documentType });
  return fetchAPI<TemplateFormatResponse[]>(`/templates/formats${query}`, { method: "GET", cache: "no-store" }, TIMEOUTS.DEFAULT);
}

export async function getTemplateById(templateId: number): Promise<Template> {
  return fetchAPI<Template>(`/templates/${templateId}`, { method: "GET" }, TIMEOUTS.DEFAULT);
}

export async function createTemplate(payload: TemplateCreateRequest): Promise<Template> {
  return fetchAPI<Template>(
    "/templates/",
    { method: "POST", body: JSON.stringify(payload) },
    TIMEOUTS.AUTH,
  );
}

export async function updateTemplate(templateId: number, payload: TemplateUpdateRequest): Promise<Template> {
  return fetchAPI<Template>(
    `/templates/${templateId}`,
    { method: "PATCH", body: JSON.stringify(payload) },
    TIMEOUTS.AUTH,
  );
}

export async function publishTemplate(templateId: number): Promise<Template> {
  return fetchAPI<Template>(`/templates/${templateId}/publish`, { method: "POST" }, TIMEOUTS.AUTH);
}

export async function archiveTemplate(templateId: number): Promise<Template> {
  return fetchAPI<Template>(`/templates/${templateId}/archive`, { method: "POST" }, TIMEOUTS.AUTH);
}

export async function previewTemplate(payload: TemplatePreviewRequest): Promise<TemplatePreviewResponse> {
  return fetchAPI<TemplatePreviewResponse>(
    "/templates/preview",
    { method: "POST", body: JSON.stringify(payload) },
    TIMEOUTS.AUTH,
  );
}

export async function generateTemplateDraft(
  request: GenerateTemplateDraftRequest,
  file?: File | null,
): Promise<PersistedTemplateDraftResponse> {
  const normalizedRequest = normalizeDraftRequest(request);

  if (!normalizedRequest.format_code?.trim()) {
    throw new Error("Debes seleccionar un formato.");
  }

  const formData = new FormData();
  formData.append("request", JSON.stringify(normalizedRequest));

  if (file) {
    formData.append("file", file);
  }

  return fetchWithFormData<PersistedTemplateDraftResponse>(
    "/templates/drafts",
    "POST",
    formData,
    TIMEOUTS.UPLOAD,
  );
}

export async function generateContractFromTemplate(
  templateId: number,
  data: TemplateGenerateContractRequest,
): Promise<Document> {
  return fetchAPI<Document>(
    `/templates/${templateId}/generate`,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    TIMEOUTS.UPLOAD,
  );
}
