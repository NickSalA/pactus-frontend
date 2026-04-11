import type {
  Document,
  GenerateTemplateDraftRequest,
  PersistedTemplateDraftResponse,
  Template,
  TemplateCreateRequest,
  TemplatePreviewRequest,
  TemplatePreviewResponse,
  TemplateUpdateRequest,
} from "@/types/api.types";
import { TIMEOUTS } from "./constants";
import { fetchAPI, fetchWithFormData } from "./fetch-client";

export interface WorkerContractFormData {
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
  folder_id?: number | null;
}

export async function getTemplates(): Promise<Template[]> {
  return fetchAPI<Template[]>("/templates/", { method: "GET", cache: "no-store" }, TIMEOUTS.DEFAULT);
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

export async function previewTemplate(payload: TemplatePreviewRequest): Promise<TemplatePreviewResponse> {
  return fetchAPI<TemplatePreviewResponse>(
    "/templates/preview",
    { method: "POST", body: JSON.stringify(payload) },
    TIMEOUTS.AUTH,
  );
}

export async function generateTemplateDraft(
  request?: GenerateTemplateDraftRequest | null,
  file?: File | null,
): Promise<PersistedTemplateDraftResponse> {
  const formData = new FormData();

  if (file) {
    formData.append("file", file);
  }

  if (request) {
    const normalized = Object.fromEntries(
      Object.entries(request).filter(([, v]) => v != null && String(v).trim() !== ""),
    );
    if (Object.keys(normalized).length > 0) {
      formData.append("request", JSON.stringify(normalized));
    }
  }

  if (!file && (!request || Object.keys(request).every((k) => !request[k as keyof GenerateTemplateDraftRequest]?.toString().trim()))) {
    throw new Error("Debes completar el formulario, subir un PDF o ambas opciones.");
  }

  return fetchWithFormData<PersistedTemplateDraftResponse>(
    "/templates/drafts",
    "POST",
    formData,
    TIMEOUTS.UPLOAD,
  );
}

export async function generateWorkerContract(
  templateId: number,
  data: WorkerContractFormData,
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
