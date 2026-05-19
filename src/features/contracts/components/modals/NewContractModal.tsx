'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronDown,
  FilePlus,
  FileText,
  LoaderCircle,
  Plus,
  Trash2,
  Upload,
  User,
  X,
} from 'lucide-react';
import { ContractFormProgress } from '@/features/contracts/components/form/ContractFormProgress';
import { Select } from '@/components/ui/Select';
import type { ContractFolder } from '@/features/contracts/lib/contracts-utils';
import { deleteDocument, getServices } from '@/api';
import { getDocumentFileUrl } from '@/api/documents';
import { generateContractFromTemplate, getTemplates } from '@/api/templates';
import { getDocumentTypeLabel } from '@/lib/document.utils';
import {
  getDefaultWritableDocumentType,
  getWritableDocumentTypes,
} from '@/lib/permissions';
import {
  getAllTemplateFields,
  getTemplateFieldCount,
  getTemplateOperationalFields,
  normalizeTemplateFieldType,
  TEMPLATE_FIELD_TYPE_LABELS,
} from '@/lib/template-fields';
import { useAuthStore } from '@/store';
import type {
  ApiCurrencyType,
  ApiDocumentServiceItemRequest,
  ApiDocumentType,
  ApiTemplateField,
  ApiTemplateResponse,
  ApiServiceResponse,
} from '@/types/api';
import type { DocumentFlatten, DocumentType } from '@/types/api.types';
import { normalizeDocument } from '../../lib/normalize-document';

const ContractForm = dynamic(
  () => import('@/features/contracts/components/form/ContractForm'),
  {
    loading: () => (
      <div className="flex h-full items-center justify-center p-8">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
          Cargando formulario...
        </div>
      </div>
    ),
  },
);

type Flow =
  | 'select-action'
  | 'upload'
  | 'select-template'
  | 'services'
  | 'folder'
  | 'fill-template';
type RequestState = 'idle' | 'loading' | 'success' | 'error';
type WizardAction = 'generate' | 'upload' | null;

type ServiceItemDraft = {
  currency: ApiCurrencyType;
  description: string;
  end_date: string;
  key: string;
  service_id: string;
  start_date: string;
  value: string;
};

type DynamicFieldValues = Record<string, string | boolean>;

type FieldSectionDefinition = {
  id: string;
  keywords: readonly string[];
  title: (documentType: DocumentType) => string;
};

type FieldSection = {
  fields: ApiTemplateField[];
  id: string;
  title: string;
};

type FieldSectionNavItem = {
  id: string;
  saved: boolean;
  title: string;
};

export type NewContractModalProps = {
  availableFolders?: readonly ContractFolder[];
  defaultFolderId?: number | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (contract: DocumentFlatten) => void;
};

const CURRENCY_OPTIONS: readonly ApiCurrencyType[] = ['PEN', 'USD', 'EUR'];

const FIELD_SECTION_DEFINITIONS: readonly FieldSectionDefinition[] = [
  {
    id: 'company',
    keywords: ['empresa', 'cliente', 'ruc', 'razon social', 'empleador'],
    title: () => 'Datos de la empresa',
  },
  {
    id: 'worker',
    keywords: ['trabajador', 'empleado', 'colaborador', 'personal'],
    title: (documentType) =>
      documentType === 'LABOR' ? 'Datos del trabajador' : 'Datos de la persona',
  },
  {
    id: 'manager',
    keywords: ['gerente', 'jefe'],
    title: () => 'Datos del gerente',
  },
  {
    id: 'representative',
    keywords: ['representante', 'apoderado', 'director', 'firmante'],
    title: () => 'Datos del representante',
  },
  {
    id: 'contract',
    keywords: [
      'contrato',
      'fecha',
      'duracion',
      'objeto',
      'vigencia',
      'modalidad',
      'alcance',
      'plazo',
    ],
    title: () => 'Datos del contrato',
  },
  {
    id: 'finance',
    keywords: [
      'remuneracion',
      'pago',
      'monto',
      'moneda',
      'valor',
      'honorario',
      'tarifa',
      'sueldo',
      'precio',
    ],
    title: (documentType) =>
      documentType === 'LABOR' ? 'Remuneración' : 'Condiciones económicas',
  },
  {
    id: 'schedule',
    keywords: ['horario', 'jornada', 'turno', 'refrigerio'],
    title: () => 'Jornada y horario',
  },
  {
    id: 'signature',
    keywords: [
      'firma',
      'ciudad',
      'lugar',
      'suscripcion',
      'dia firma',
      'mes firma',
      'anio firma',
    ],
    title: () => 'Firma y cierre',
  },
  {
    id: 'other',
    keywords: [],
    title: () => 'Otros datos',
  },
] as const;

const LONG_TEXT_HINTS = [
  'direccion',
  'domicilio',
  'objeto',
  'descripcion',
  'detalle',
  'causas',
  'actividades',
  'alcance',
  'funciones',
];

const createDraftKey = (): string => {
  return typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 10);
};

const createEmptyServiceItem = (): ServiceItemDraft => ({
  currency: 'USD',
  description: '',
  end_date: '',
  key: createDraftKey(),
  service_id: '',
  start_date: '',
  value: '',
});

const normalizeSearchText = (value: string): string => {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/_/g, ' ')
    .trim();
};

const getOperationalNameKey = (
  documentType: DocumentType,
): 'cliente_nombre' | 'trabajador_nombre' => {
  return documentType === 'COMPANY' ? 'cliente_nombre' : 'trabajador_nombre';
};

const getOperationalNameLabel = (documentType: DocumentType): string => {
  return documentType === 'COMPANY'
    ? 'Nombre del cliente'
    : 'Nombre del trabajador';
};

const getOperationalNamePlaceholder = (documentType: DocumentType): string => {
  return documentType === 'COMPANY'
    ? 'Ej: Holiday Inn Management'
    : 'Ej: Juan Pérez';
};

const buildInitialFieldValues = (
  template: ApiTemplateResponse | null,
): DynamicFieldValues => {
  if (!template) {
    return {};
  }

  return Object.fromEntries(
    getAllTemplateFields(template.content).map((field) => [
      field.key,
      normalizeTemplateFieldType(field.type) === 'boolean' ? false : '',
    ]),
  );
};

const isFieldFilled = (
  field: ApiTemplateField,
  value: string | boolean | undefined,
): boolean => {
  const fieldType = normalizeTemplateFieldType(field.type);

  if (fieldType === 'boolean') {
    return value === true;
  }

  return typeof value === 'string' && value.trim() !== '';
};

const shouldUseTextarea = (field: ApiTemplateField): boolean => {
  const searchable = normalizeSearchText(`${field.key} ${field.label}`);
  return LONG_TEXT_HINTS.some((hint) => searchable.includes(hint));
};

const getFieldPlaceholder = (field: ApiTemplateField): string => {
  if (typeof field.placeholder === 'string' && field.placeholder.trim()) {
    return field.placeholder;
  }

  const fieldType = normalizeTemplateFieldType(field.type);

  if (fieldType === 'date') {
    return '';
  }

  if (fieldType === 'time') {
    return 'HH:MM';
  }

  if (fieldType === 'number') {
    return 'Ingresa un valor';
  }

  return `Completa ${field.label.toLowerCase()}`;
};

const groupTemplateFields = (
  fields: readonly ApiTemplateField[],
  documentType: ApiDocumentType,
): FieldSection[] => {
  const groupedSections = FIELD_SECTION_DEFINITIONS.map((definition) => ({
    fields: [] as ApiTemplateField[],
    id: definition.id,
    title: definition.title(documentType),
  }));

  for (const field of fields) {
    const searchable = normalizeSearchText(`${field.key} ${field.label}`);
    const matchedDefinition =
      FIELD_SECTION_DEFINITIONS.find(
        (definition) =>
          definition.id !== 'other' &&
          definition.keywords.some((keyword) => searchable.includes(keyword)),
      ) ?? FIELD_SECTION_DEFINITIONS[FIELD_SECTION_DEFINITIONS.length - 1];

    const targetSection = groupedSections.find(
      (section) => section.id === matchedDefinition.id,
    );
    targetSection?.fields.push(field);
  }

  return groupedSections.filter((section) => section.fields.length > 0);
};

const buildTemplateFieldSections = (
  template: ApiTemplateResponse | null,
): FieldSection[] => {
  if (!template) {
    return [];
  }

  const contractSections = groupTemplateFields(
    template.content.fields,
    template.document_type,
  );
  const operationalFields = getTemplateOperationalFields(template.content);

  if (operationalFields.length === 0) {
    return contractSections;
  }

  return [
    ...contractSections,
    {
      id: 'operational-fields',
      title: 'Campos operativos',
      fields: operationalFields,
    },
  ];
};

function SelectionCard({
  badge,
  description,
  disabled,
  icon,
  onClick,
  selected,
  title,
}: {
  badge?: { colorClass: string; label: string };
  description: string;
  disabled?: boolean;
  icon: ReactNode;
  onClick?: () => void;
  selected?: boolean;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`relative flex h-full flex-col items-center justify-center gap-4 rounded-2xl border-2 p-7 text-center transition-all duration-150 ${
        disabled
          ? 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-60'
          : selected
            ? 'border-blue-500 bg-blue-50/70 shadow-sm'
            : 'border-slate-200 bg-white hover:border-blue-400 hover:shadow-md active:scale-[0.98]'
      }`}
    >
      {badge && (
        <span
          className={`absolute right-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-semibold ${badge.colorClass}`}
        >
          {badge.label}
        </span>
      )}
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${selected ? 'bg-blue-100' : disabled ? 'bg-slate-100' : 'bg-blue-50'}`}
      >
        {icon}
      </div>
      <div className="space-y-1">
        <p
          className={`text-sm font-semibold ${disabled ? 'text-slate-400' : 'text-slate-800'}`}
        >
          {title}
        </p>
        <p
          className={`text-xs leading-relaxed ${disabled ? 'text-slate-400' : 'text-slate-500'}`}
        >
          {description}
        </p>
      </div>
    </button>
  );
}

function LabeledField({
  label,
  children,
  required,
}: {
  children: ReactNode;
  label: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-slate-600">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}

function StepHeading({
  currentStep,
  description,
  title,
  totalSteps,
}: {
  currentStep: number;
  description: string;
  title: string;
  totalSteps: number;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        Paso {currentStep} de {totalSteps}
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}

function FieldSectionCard({
  children,
  expanded,
  onToggle,
  saved,
  title,
}: {
  children: ReactNode;
  expanded: boolean;
  onToggle: () => void;
  saved: boolean;
  title: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-3xl border shadow-sm transition-colors ${saved ? 'border-emerald-300 bg-emerald-50/40' : 'border-slate-200 bg-white'}`}
    >
      <button
        type="button"
        onClick={onToggle}
        className={`flex w-full items-center justify-between gap-4 px-5 py-3 text-left transition ${saved ? 'hover:bg-emerald-50/60' : 'hover:bg-slate-50'}`}
      >
        <div>
          <p className="text-base font-semibold text-slate-900">{title}</p>
          {saved && (
            <p className="mt-0.5 text-xs text-slate-500">
              Sección guardada · puedes editarla si lo necesitas
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${saved ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}
          >
            {saved ? 'Guardada' : 'Pendiente'}
          </span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {expanded && <div className="border-t border-slate-200">{children}</div>}
    </div>
  );
}

function FieldSectionTimeline({
  activeId,
  items,
  onSelect,
}: {
  activeId: string | null;
  items: readonly FieldSectionNavItem[];
  onSelect: (id: string) => void;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        Áreas del contrato
      </p>
      <div className="mt-4 space-y-1">
        {items.map((item, index) => {
          const isActive = item.id === activeId;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`grid w-full grid-cols-[20px_minmax(0,1fr)] gap-3 rounded-2xl px-3 py-3 text-left transition ${
                isActive
                  ? 'bg-white shadow-sm ring-1 ring-blue-200'
                  : 'hover:bg-white/70'
              }`}
            >
              <div className="flex flex-col items-center">
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    item.saved
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : isActive
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-slate-300 bg-white text-slate-400'
                  }`}
                >
                  {item.saved ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-current" />
                  )}
                </span>
                {index < items.length - 1 && (
                  <span
                    className={`mt-1 h-8 w-px ${item.saved ? 'bg-emerald-300' : 'bg-slate-200'}`}
                  />
                )}
              </div>

              <div className="min-w-0 pt-0.5">
                <p
                  className={`text-sm font-semibold ${isActive ? 'text-slate-900' : 'text-slate-700'}`}
                >
                  {item.title}
                </p>
                <p
                  className={`mt-0.5 text-xs ${item.saved ? 'text-emerald-700' : 'text-slate-500'}`}
                >
                  {item.saved ? 'Completada' : 'Pendiente'}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FieldSectionHorizontalStepper({
  activeId,
  items,
  onSelect,
}: {
  activeId: string | null;
  items: readonly FieldSectionNavItem[];
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-0.5 overflow-x-auto">
      {items.map((item, index) => {
        const isActive = item.id === activeId;

        return (
          <div key={item.id} className="flex shrink-0 items-center">
            <button
              type="button"
              onClick={() => onSelect(item.id)}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 transition ${
                isActive
                  ? 'bg-white shadow-sm ring-1 ring-blue-200'
                  : 'hover:bg-white/70'
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-bold ${
                  item.saved
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : isActive
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-slate-300 bg-white text-slate-400'
                }`}
              >
                {item.saved ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                )}
              </span>
              <span
                className={`whitespace-nowrap text-xs font-medium ${
                  isActive
                    ? 'text-slate-900'
                    : item.saved
                      ? 'text-emerald-700'
                      : 'text-slate-600'
                }`}
              >
                {item.title}
              </span>
            </button>
            {index < items.length - 1 && (
              <div
                className={`mx-0.5 h-px w-3 shrink-0 ${item.saved ? 'bg-emerald-300' : 'bg-slate-200'}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function NewContractModal({
  availableFolders = [],
  defaultFolderId = null,
  open,
  onClose,
  onSubmit,
}: NewContractModalProps) {
  const userRole = useAuthStore((state) => state.user?.role ?? null);
  const allowedDocumentTypes = getWritableDocumentTypes(userRole);
  const defaultDocumentType =
    getDefaultWritableDocumentType(userRole) ?? 'COMPANY';

  const [flow, setFlow] = useState<Flow>('select-action');
  const [selectedAction, setSelectedAction] = useState<WizardAction>(null);
  const [templates, setTemplates] = useState<ApiTemplateResponse[]>([]);
  const [templatesState, setTemplatesState] = useState<RequestState>('idle');
  const [templatesError, setTemplatesError] = useState<string | null>(null);
  const [selectedDocumentType, setSelectedDocumentType] =
    useState<DocumentType>(defaultDocumentType);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
    null,
  );
  const [fieldValues, setFieldValues] = useState<DynamicFieldValues>({});
  const [folderId, setFolderId] = useState<number | null>(defaultFolderId);
  const [partyName, setPartyName] = useState('');
  const [serviceItems, setServiceItems] = useState<ServiceItemDraft[]>([]);
  const [services, setServices] = useState<ApiServiceResponse[]>([]);
  const [servicesState, setServicesState] = useState<RequestState>('idle');
  const [servicesError, setServicesError] = useState<string | null>(null);
  const [submitState, setSubmitState] = useState<RequestState>('idle');
  const [flowError, setFlowError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generatedDocument, setGeneratedDocument] =
    useState<DocumentFlatten | null>(null);
  const [openFieldSections, setOpenFieldSections] = useState<
    Record<string, boolean>
  >({});
  const [savedFieldSections, setSavedFieldSections] = useState<
    Record<string, boolean>
  >({});
  const [isOperationalFieldSaved, setIsOperationalFieldSaved] = useState(true);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const selectedTemplate = useMemo(() => {
    return (
      templates.find((template) => template.id === selectedTemplateId) ?? null
    );
  }, [selectedTemplateId, templates]);

  const visibleTemplates = useMemo(() => {
    return templates.filter(
      (template) => template.document_type === selectedDocumentType,
    );
  }, [selectedDocumentType, templates]);

  const canChooseDocumentType = (allowedDocumentTypes?.length ?? 0) !== 1;
  const showServicesStep = selectedDocumentType === 'COMPANY';
  const wizardSteps = showServicesStep
    ? [
        'Tipo de acción',
        'Plantilla',
        'Servicios',
        'Carpeta destino',
        'Datos del contrato',
      ]
    : ['Tipo de acción', 'Plantilla', 'Carpeta destino', 'Datos del contrato'];
  const currentWizardStep =
    flow === 'fill-template'
      ? wizardSteps.length
      : flow === 'folder'
        ? wizardSteps.length - 1
        : flow === 'services'
          ? 3
          : flow === 'select-template'
            ? 2
            : 1;

  const operationalNameKey = getOperationalNameKey(
    selectedTemplate?.document_type ?? selectedDocumentType,
  );
  const operationalNameLabel = getOperationalNameLabel(
    selectedTemplate?.document_type ?? selectedDocumentType,
  );
  const operationalNamePlaceholder = getOperationalNamePlaceholder(
    selectedTemplate?.document_type ?? selectedDocumentType,
  );

  const selectedFolderName = useMemo(() => {
    return (
      availableFolders.find((folder) => folder.id === folderId)?.name ?? null
    );
  }, [availableFolders, folderId]);

  const serviceNameById = useMemo(() => {
    return new Map(
      services.map((service) => [String(service.id), service.name]),
    );
  }, [services]);

  const fieldSections = useMemo(() => {
    return buildTemplateFieldSections(selectedTemplate);
  }, [selectedTemplate]);

  const fieldSectionIdByFieldKey = useMemo(() => {
    return new Map(
      fieldSections.flatMap((section) =>
        section.fields.map((field) => [field.key, section.id] as const),
      ),
    );
  }, [fieldSections]);

  const templateHasOperationalNameField = useMemo(() => {
    return selectedTemplate
      ? getAllTemplateFields(selectedTemplate.content).some(
          (field) => field.key === operationalNameKey,
        )
      : false;
  }, [operationalNameKey, selectedTemplate]);

  const needsOperationalNameField =
    Boolean(selectedTemplate) && !templateHasOperationalNameField;

  const requiredFieldsCount = getAllTemplateFields(
    selectedTemplate?.content,
  ).filter((field) => field.required).length;
  const completedRequiredFieldsCount = getAllTemplateFields(
    selectedTemplate?.content,
  ).reduce((count, field) => {
    return field.required && isFieldFilled(field, fieldValues[field.key])
      ? count + 1
      : count;
  }, 0);

  const resetGenerationState = useCallback(() => {
    setSelectedTemplateId(null);
    setFieldValues({});
    setFolderId(defaultFolderId);
    setPartyName('');
    setServiceItems([]);
    setSubmitState('idle');
    setFlowError(null);
    setPreviewUrl(null);
    setGeneratedDocument(null);
    setOpenFieldSections({});
    setSavedFieldSections({});
    setIsOperationalFieldSaved(true);
    setCurrentSectionIndex(0);
  }, [defaultFolderId]);

  const resetModal = useCallback(() => {
    setFlow('select-action');
    setSelectedAction(null);
    setSelectedDocumentType(defaultDocumentType);
    resetGenerationState();
    setTemplatesError(null);
    setServices([]);
    setServicesState('idle');
    setServicesError(null);
  }, [defaultDocumentType, resetGenerationState]);

  useEffect(() => {
    if (!open) {
      const timeoutId = window.setTimeout(() => {
        resetModal();
      }, 0);

      return () => {
        window.clearTimeout(timeoutId);
      };
    }
  }, [open, resetModal]);

  useEffect(() => {
    if (!selectedTemplate || selectedTemplate.document_type !== 'COMPANY') {
      return;
    }

    if (servicesState !== 'idle') {
      return;
    }

    const loadServices = async () => {
      try {
        setServicesState('loading');
        setServicesError(null);
        setServices(await getServices());
        setServicesState('success');
      } catch (error) {
        setServicesState('error');
        setServicesError(
          error instanceof Error
            ? error.message
            : 'No se pudo cargar el catálogo de servicios.',
        );
      }
    };

    void loadServices();
  }, [selectedTemplate, servicesState]);

  const loadPublishedTemplates = useCallback(async () => {
    try {
      setTemplatesState('loading');
      setTemplatesError(null);
      const publishedTemplates = await getTemplates({ state: 'PUBLISHED' });
      setTemplates(publishedTemplates);
      setTemplatesState('success');
    } catch (error) {
      setTemplatesState('error');
      setTemplatesError(
        error instanceof Error
          ? error.message
          : 'No se pudieron cargar las plantillas publicadas.',
      );
    }
  }, []);

  const handleClose = useCallback(() => {
    if (generatedDocument) {
      void deleteDocument(generatedDocument.id).catch(() => undefined);
    }

    onClose();
    window.setTimeout(() => {
      resetModal();
    }, 300);
  }, [generatedDocument, onClose, resetModal]);

  const clearGeneratedPreview = useCallback(() => {
    if (generatedDocument) {
      void deleteDocument(generatedDocument.id).catch(() => undefined);
    }

    setSubmitState('idle');
    setFlowError(null);
    setPreviewUrl(null);
    setGeneratedDocument(null);
  }, [generatedDocument]);

  const handleDocumentTypeChange = useCallback((documentType: DocumentType) => {
    setSelectedDocumentType(documentType);
    setSelectedTemplateId(null);
    setFieldValues({});
    setPartyName('');
    setServiceItems([]);
    setSubmitState('idle');
    setFlowError(null);
    setPreviewUrl(null);
    setGeneratedDocument(null);
    setOpenFieldSections({});
    setSavedFieldSections({});
    setIsOperationalFieldSaved(true);
    setCurrentSectionIndex(0);
  }, []);

  const handleSelectTemplate = useCallback((template: ApiTemplateResponse) => {
    const initialSections = buildTemplateFieldSections(template);
    const operationalFieldNeeded = !getAllTemplateFields(template.content).some(
      (field) => field.key === getOperationalNameKey(template.document_type),
    );
    const nextOpenSections = Object.fromEntries(
      initialSections.map((section, index) => [
        section.id,
        !operationalFieldNeeded && index === 0,
      ]),
    );

    if (operationalFieldNeeded) {
      nextOpenSections.operational = true;
    }

    setSelectedTemplateId(template.id);
    setFieldValues(buildInitialFieldValues(template));
    setPartyName('');
    setServiceItems([]);
    setSubmitState('idle');
    setFlowError(null);
    setPreviewUrl(null);
    setGeneratedDocument(null);
    setOpenFieldSections(nextOpenSections);
    setSavedFieldSections(
      Object.fromEntries(initialSections.map((section) => [section.id, false])),
    );
    setIsOperationalFieldSaved(!operationalFieldNeeded);
    setCurrentSectionIndex(0);
  }, []);

  const handleDynamicFieldChange = (
    fieldKey: string,
    value: string | boolean,
  ) => {
    if (submitState === 'success') {
      clearGeneratedPreview();
    }

    const sectionId = fieldSectionIdByFieldKey.get(fieldKey);
    if (sectionId) {
      setSavedFieldSections((previous) => ({
        ...previous,
        [sectionId]: false,
      }));
    }

    setFieldValues((previous) => ({ ...previous, [fieldKey]: value }));
    setFlowError(null);
    if (submitState === 'error') {
      setSubmitState('idle');
    }
  };

  const handleServiceItemChange = (
    serviceKey: string,
    field: keyof Omit<ServiceItemDraft, 'key'>,
    value: string,
  ) => {
    if (submitState === 'success') {
      clearGeneratedPreview();
    }

    setServiceItems((previous) =>
      previous.map((item) =>
        item.key === serviceKey ? { ...item, [field]: value } : item,
      ),
    );
    setFlowError(null);
    if (submitState === 'error') {
      setSubmitState('idle');
    }
  };

  const validateRequiredFields = useCallback((): string | null => {
    if (!selectedTemplate) {
      return 'Debes elegir una plantilla antes de continuar.';
    }

    for (const field of getAllTemplateFields(selectedTemplate.content)) {
      if (!field.required) {
        continue;
      }

      const value = fieldValues[field.key];
      const fieldType = normalizeTemplateFieldType(field.type);

      if (fieldType === 'boolean') {
        if (value !== true) {
          return `Completa el dato obligatorio: ${field.label}.`;
        }
        continue;
      }

      if (typeof value !== 'string' || value.trim() === '') {
        return `Completa el dato obligatorio: ${field.label}.`;
      }
    }

    return null;
  }, [fieldValues, selectedTemplate]);

  const validateFieldSection = useCallback(
    (section: FieldSection): string | null => {
      for (const field of section.fields) {
        if (!field.required) {
          continue;
        }

        if (!isFieldFilled(field, fieldValues[field.key])) {
          return `Completa el dato obligatorio: ${field.label}.`;
        }
      }

      return null;
    },
    [fieldValues],
  );

  const generationValidationError = useMemo(() => {
    const baseError = validateRequiredFields();

    if (baseError) {
      return baseError;
    }

    if (needsOperationalNameField && !partyName.trim()) {
      return `Completa ${operationalNameLabel.toLowerCase()}.`;
    }

    return null;
  }, [
    needsOperationalNameField,
    operationalNameLabel,
    partyName,
    validateRequiredFields,
  ]);

  const allFieldSectionsSaved = useMemo(() => {
    return (
      fieldSections.every((section) => savedFieldSections[section.id]) &&
      (!needsOperationalNameField || isOperationalFieldSaved)
    );
  }, [
    fieldSections,
    isOperationalFieldSaved,
    needsOperationalNameField,
    savedFieldSections,
  ]);

  const sectionTimelineItems = useMemo<FieldSectionNavItem[]>(() => {
    const items: FieldSectionNavItem[] = [];

    if (needsOperationalNameField) {
      items.push({
        id: 'operational',
        saved: isOperationalFieldSaved,
        title: 'Dato principal',
      });
    }

    items.push(
      ...fieldSections.map((section) => ({
        id: section.id,
        saved: Boolean(savedFieldSections[section.id]),
        title: section.title,
      })),
    );

    return items;
  }, [
    fieldSections,
    isOperationalFieldSaved,
    needsOperationalNameField,
    savedFieldSections,
  ]);

  const activeSectionId = useMemo(() => {
    return (
      sectionTimelineItems.find((item) => openFieldSections[item.id])?.id ??
      null
    );
  }, [openFieldSections, sectionTimelineItems]);

  const currentSectionItem = sectionTimelineItems[currentSectionIndex] ?? null;
  const isCurrentSectionOperational = currentSectionItem?.id === 'operational';
  const currentFieldSection = useMemo(() => {
    if (!currentSectionItem || isCurrentSectionOperational) return null;
    return (
      fieldSections.find((section) => section.id === currentSectionItem.id) ??
      null
    );
  }, [currentSectionItem, fieldSections, isCurrentSectionOperational]);
  const isLastSection =
    sectionTimelineItems.length > 0 &&
    currentSectionIndex === sectionTimelineItems.length - 1;

  const handleSaveFieldSection = useCallback(
    (section: FieldSection, index: number) => {
      const validationError = validateFieldSection(section);

      if (validationError) {
        setFlowError(validationError);
        return;
      }

      const nextSection = fieldSections[index + 1];

      setFlowError(null);
      setSavedFieldSections((previous) => ({
        ...previous,
        [section.id]: true,
      }));
      const nextOpenState = Object.fromEntries(
        sectionTimelineItems.map((item) => [item.id, false]),
      );

      if (nextSection) {
        nextOpenState[nextSection.id] = true;
      }

      setOpenFieldSections(nextOpenState);
    },
    [fieldSections, sectionTimelineItems, validateFieldSection],
  );

  const handleSaveOperationalField = useCallback(() => {
    if (!partyName.trim()) {
      setFlowError(`Completa ${operationalNameLabel.toLowerCase()}.`);
      return;
    }

    setFlowError(null);
    setIsOperationalFieldSaved(true);
    const nextOpenState = Object.fromEntries(
      sectionTimelineItems.map((item) => [item.id, false]),
    );

    if (fieldSections[0]) {
      nextOpenState[fieldSections[0].id] = true;
    }

    setOpenFieldSections(nextOpenState);
  }, [fieldSections, operationalNameLabel, partyName, sectionTimelineItems]);

  const handleOpenFieldSection = useCallback(
    (sectionId: string) => {
      const nextState = Object.fromEntries(
        sectionTimelineItems.map((item) => [item.id, item.id === sectionId]),
      );
      setOpenFieldSections(nextState);
    },
    [sectionTimelineItems],
  );

  const handleSaveCurrentSection = useCallback(() => {
    if (isCurrentSectionOperational) {
      if (!partyName.trim()) {
        setFlowError(`Completa ${operationalNameLabel.toLowerCase()}.`);
        return;
      }
      setFlowError(null);
      setIsOperationalFieldSaved(true);
    } else if (currentFieldSection) {
      const error = validateFieldSection(currentFieldSection);
      if (error) {
        setFlowError(error);
        return;
      }
      setFlowError(null);
      setSavedFieldSections((previous) => ({
        ...previous,
        [currentFieldSection.id]: true,
      }));
    }
  }, [
    currentFieldSection,
    isCurrentSectionOperational,
    operationalNameLabel,
    partyName,
    validateFieldSection,
  ]);

  const handleSectionNext = useCallback(() => {
    if (isCurrentSectionOperational) {
      if (!partyName.trim()) {
        setFlowError(`Completa ${operationalNameLabel.toLowerCase()}.`);
        return;
      }
      setFlowError(null);
      setIsOperationalFieldSaved(true);
    } else if (currentFieldSection) {
      const error = validateFieldSection(currentFieldSection);
      if (error) {
        setFlowError(error);
        return;
      }
      setFlowError(null);
      setSavedFieldSections((previous) => ({
        ...previous,
        [currentFieldSection.id]: true,
      }));
    }
    setCurrentSectionIndex((previous) => previous + 1);
  }, [
    currentFieldSection,
    isCurrentSectionOperational,
    operationalNameLabel,
    partyName,
    validateFieldSection,
  ]);

  const handleSectionPrevious = useCallback(() => {
    setFlowError(null);
    if (currentSectionIndex === 0) {
      if (submitState === 'success') clearGeneratedPreview();
      setFlow('folder');
      return;
    }
    setCurrentSectionIndex((previous) => previous - 1);
  }, [clearGeneratedPreview, currentSectionIndex, submitState]);

  const buildServiceItemsPayload =
    useCallback((): ApiDocumentServiceItemRequest[] => {
      return serviceItems.map((item, index) => {
        if (!item.service_id.trim()) {
          throw new Error(`Selecciona un servicio en la fila ${index + 1}.`);
        }

        if (!item.value.trim() || Number.isNaN(Number(item.value))) {
          throw new Error(`Ingresa un valor válido en la fila ${index + 1}.`);
        }

        if (!item.start_date || !item.end_date) {
          throw new Error(
            `Completa las fechas del servicio en la fila ${index + 1}.`,
          );
        }

        if (item.end_date < item.start_date) {
          throw new Error(
            `La fecha de fin del servicio ${index + 1} no puede ser anterior a la fecha de inicio.`,
          );
        }

        return {
          currency: item.currency,
          description: item.description.trim() || null,
          end_date: item.end_date,
          service_id: Number(item.service_id),
          start_date: item.start_date,
          value: Number(item.value),
        };
      });
    }, [serviceItems]);

  const buildTemplatePayload = useCallback((): Record<string, unknown> => {
    if (!selectedTemplate) {
      return {};
    }

    const payload: Record<string, unknown> = {};

    getAllTemplateFields(selectedTemplate.content).forEach((field) => {
      const rawValue = fieldValues[field.key];
      const fieldType = normalizeTemplateFieldType(field.type);

      if (fieldType === 'boolean') {
        payload[field.key] = rawValue === true;
        return;
      }

      if (typeof rawValue !== 'string') {
        return;
      }

      const normalizedValue = rawValue.trim();
      if (!normalizedValue) {
        return;
      }

      payload[field.key] =
        fieldType === 'number' ? Number(normalizedValue) : normalizedValue;
    });

    const dynamicOperationalName =
      typeof payload[operationalNameKey] === 'string'
        ? (payload[operationalNameKey] as string)
        : '';
    const normalizedPartyName = partyName.trim() || dynamicOperationalName;

    if (normalizedPartyName) {
      payload[operationalNameKey] = normalizedPartyName;
    }

    if (folderId !== null) {
      payload.folder_id = folderId;
    }

    if (
      selectedTemplate.document_type === 'COMPANY' &&
      serviceItems.length > 0
    ) {
      payload.service_items = buildServiceItemsPayload();
    }

    return payload;
  }, [
    buildServiceItemsPayload,
    fieldValues,
    folderId,
    operationalNameKey,
    partyName,
    selectedTemplate,
    serviceItems,
  ]);

  const handleGenerateContract = useCallback(async () => {
    if (!selectedTemplate) {
      setFlowError('Debes elegir una plantilla antes de continuar.');
      return;
    }

    const validationError = generationValidationError;
    if (validationError) {
      setFlowError(validationError);
      return;
    }

    setSubmitState('loading');
    setFlowError(null);
    setPreviewUrl(null);
    setGeneratedDocument(null);

    try {
      const payload = buildTemplatePayload();
      const document = await generateContractFromTemplate(
        selectedTemplate.id,
        payload,
      );
      setGeneratedDocument(normalizeDocument(document));
      setPreviewUrl(await getDocumentFileUrl(document.id));
      setSubmitState('success');
    } catch (error) {
      setSubmitState('error');
      setFlowError(
        error instanceof Error
          ? error.message
          : 'No se pudo generar el contrato.',
      );
    }
  }, [buildTemplatePayload, generationValidationError, selectedTemplate]);

  const handleGenerateOnLastSection = useCallback(async () => {
    if (isCurrentSectionOperational) {
      if (!partyName.trim()) {
        setFlowError(`Completa ${operationalNameLabel.toLowerCase()}.`);
        return;
      }
      setIsOperationalFieldSaved(true);
    } else if (currentFieldSection) {
      const error = validateFieldSection(currentFieldSection);
      if (error) {
        setFlowError(error);
        return;
      }
      setSavedFieldSections((previous) => ({
        ...previous,
        [currentFieldSection.id]: true,
      }));
    }
    setFlowError(null);
    await handleGenerateContract();
  }, [
    currentFieldSection,
    handleGenerateContract,
    isCurrentSectionOperational,
    operationalNameLabel,
    partyName,
    validateFieldSection,
  ]);

  const handleSaveGeneratedContract = useCallback(() => {
    if (!generatedDocument) {
      return;
    }

    onSubmit(generatedDocument);
    onClose();
    window.setTimeout(() => {
      resetModal();
    }, 300);
  }, [generatedDocument, onClose, onSubmit, resetModal]);

  const handlePrimaryAction = useCallback(async () => {
    if (flow === 'select-action') {
      if (!selectedAction) {
        setFlowError(
          'Selecciona cómo quieres agregar el contrato para continuar.',
        );
        return;
      }

      setFlowError(null);

      if (selectedAction === 'upload') {
        setFlow('upload');
        return;
      }

      resetGenerationState();
      setFlow('select-template');
      await loadPublishedTemplates();
      return;
    }

    if (flow === 'select-template') {
      if (!selectedTemplate) {
        setFlowError('Selecciona una plantilla para continuar.');
        return;
      }

      setFlowError(null);
      setFlow(showServicesStep ? 'services' : 'folder');
      return;
    }

    if (flow === 'services') {
      try {
        buildServiceItemsPayload();
        setFlowError(null);
        setFlow('folder');
      } catch (error) {
        setFlowError(
          error instanceof Error
            ? error.message
            : 'Revisa los servicios antes de continuar.',
        );
      }
      return;
    }

    if (flow === 'folder') {
      setFlowError(null);
      setFlow('fill-template');
      return;
    }

    if (flow === 'fill-template') {
      if (submitState === 'success') {
        handleClose();
        return;
      }

      await handleGenerateContract();
    }
  }, [
    buildServiceItemsPayload,
    flow,
    handleClose,
    handleGenerateContract,
    loadPublishedTemplates,
    resetGenerationState,
    selectedAction,
    selectedTemplate,
    showServicesStep,
    submitState,
  ]);

  const handleSecondaryAction = useCallback(() => {
    if (flow === 'select-action') {
      handleClose();
      return;
    }

    if (flow === 'select-template') {
      setFlowError(null);
      setFlow('select-action');
      return;
    }

    if (flow === 'services') {
      setFlowError(null);
      setFlow('select-template');
      return;
    }

    if (flow === 'folder') {
      setFlowError(null);
      setFlow(showServicesStep ? 'services' : 'select-template');
      return;
    }

    if (flow === 'fill-template') {
      setFlowError(null);
      if (submitState === 'success') {
        clearGeneratedPreview();
      }
      setFlow('folder');
    }
  }, [clearGeneratedPreview, flow, handleClose, showServicesStep, submitState]);

  const primaryButtonDisabled =
    flow === 'select-action'
      ? !selectedAction
      : flow === 'select-template'
        ? templatesState === 'loading' || !selectedTemplate
        : false;

  const primaryButtonLabel = 'Continuar';

  const secondaryButtonLabel =
    flow === 'select-action' ? 'Cancelar' : 'Anterior';

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="relative flex h-[94vh] max-h-[980px] w-full max-w-[1280px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-black"
        >
          <X className="h-5 w-5" />
        </button>

        {flow === 'upload' ? (
          <ContractForm
            availableFolders={availableFolders}
            defaultFolderId={defaultFolderId}
            onAdd={onSubmit}
            onClose={() => {
              setFlowError(null);
              setFlow('select-action');
            }}
          />
        ) : (
          <>
            {flow !== 'select-action' && (
              <div className="shrink-0 border-b border-slate-100 px-7 pb-2 pt-6">
                <ContractFormProgress
                  currentStep={currentWizardStep}
                  steps={wizardSteps}
                />
              </div>
            )}

            <div className="min-h-0 flex-1 overflow-hidden px-7 pb-6 pt-6">
              {flow === 'select-action' && (
                <div className="mx-auto flex h-full w-full max-w-5xl flex-col">
                  <StepHeading
                    currentStep={currentWizardStep}
                    description="Elige si quieres subir un contrato existente o generar uno desde una plantilla publicada."
                    title="¿Cómo quieres agregar el contrato?"
                    totalSteps={wizardSteps.length}
                  />

                  {flowError && (
                    <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {flowError}
                    </div>
                  )}

                  <div className="mt-6 grid flex-1 auto-rows-fr gap-4 md:grid-cols-2">
                    <SelectionCard
                      description="Carga un PDF ya firmado o en proceso para organizarlo dentro de tus contratos."
                      icon={<Upload className="h-7 w-7 text-blue-600" />}
                      onClick={() => {
                        setSelectedAction('upload');
                        setFlowError(null);
                      }}
                      selected={selectedAction === 'upload'}
                      title="Subir contrato existente"
                    />
                    <SelectionCard
                      description="Elige una plantilla y completa los datos del contrato paso a paso."
                      icon={<FilePlus className="h-7 w-7 text-blue-600" />}
                      onClick={() => {
                        setSelectedAction('generate');
                        setFlowError(null);
                      }}
                      selected={selectedAction === 'generate'}
                      title="Generar con plantilla"
                    />
                  </div>
                </div>
              )}

              {flow === 'select-template' && (
                <div className="mx-auto flex h-full w-full max-w-5xl flex-col overflow-y-auto pr-1">
                  <StepHeading
                    currentStep={currentWizardStep}
                    description="Selecciona la plantilla que mejor se ajuste al contrato que vas a generar."
                    title="Elige una plantilla"
                    totalSteps={wizardSteps.length}
                  />

                  {flowError && (
                    <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {flowError}
                    </div>
                  )}

                  <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          Plantillas disponibles
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          Revisa el nombre, el formato y la descripción antes de
                          continuar.
                        </p>
                      </div>

                      {canChooseDocumentType ? (
                        <Select
                          variant="md"
                          value={selectedDocumentType}
                          onChange={(event) =>
                            handleDocumentTypeChange(
                              event.target.value as DocumentType,
                            )
                          }
                        >
                          {(allowedDocumentTypes ?? ['LABOR', 'COMPANY']).map(
                            (documentType) => (
                              <option key={documentType} value={documentType}>
                                {getDocumentTypeLabel(documentType)}
                              </option>
                            ),
                          )}
                        </Select>
                      ) : (
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">
                          {getDocumentTypeLabel(selectedDocumentType)}
                        </span>
                      )}
                    </div>

                    {templatesState === 'loading' && (
                      <div className="flex min-h-[280px] items-center justify-center">
                        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                          <LoaderCircle className="h-4 w-4 animate-spin" />
                          Cargando plantillas publicadas...
                        </div>
                      </div>
                    )}

                    {templatesState !== 'loading' && templatesError && (
                      <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {templatesError}
                      </div>
                    )}

                    {templatesState !== 'loading' && !templatesError && (
                      <div className="mt-5 grid auto-rows-max gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {visibleTemplates.map((template) => {
                          const isSelected = template.id === selectedTemplateId;

                          return (
                            <button
                              key={template.id}
                              type="button"
                              onClick={() => {
                                handleSelectTemplate(template);
                                setFlowError(null);
                              }}
                              className={`rounded-3xl border p-5 text-left transition ${
                                isSelected
                                  ? 'border-blue-500 bg-blue-50/70 shadow-sm'
                                  : 'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/30 hover:shadow-sm'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="font-semibold text-slate-900">
                                    {template.name}
                                  </p>
                                  {template.format_label && (
                                    <p className="mt-1 text-xs text-slate-500">
                                      {template.format_label}
                                    </p>
                                  )}
                                </div>
                                {isSelected && (
                                  <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-600" />
                                )}
                              </div>

                              <p className="mt-4 text-sm leading-6 text-slate-600">
                                {template.description ??
                                  'Sin descripción adicional.'}
                              </p>

                              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
                                  {getTemplateFieldCount(template.content)} dato
                                  {getTemplateFieldCount(template.content) === 1
                                    ? ''
                                    : 's'}
                                </span>
                                <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
                                  Publicada
                                </span>
                              </div>
                            </button>
                          );
                        })}

                        {visibleTemplates.length === 0 && (
                          <div className="col-span-full rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-sm text-slate-500">
                            No hay plantillas publicadas disponibles para el
                            tipo documental seleccionado.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {flow === 'services' && selectedTemplate && (
                <div className="mx-auto flex h-full w-full max-w-5xl flex-col overflow-y-auto pr-1">
                  <StepHeading
                    currentStep={currentWizardStep}
                    description="Selecciona los servicios que formarán parte de este contrato. Puedes continuar sin agregar servicios."
                    title="Servicios del contrato"
                    totalSteps={wizardSteps.length}
                  />

                  {flowError && (
                    <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {flowError}
                    </div>
                  )}

                  <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          Servicios seleccionados
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          Cada servicio puede incluir descripción, valor y rango
                          de fechas.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (submitState === 'success') {
                            clearGeneratedPreview();
                          }
                          setServiceItems((previous) => [
                            ...previous,
                            createEmptyServiceItem(),
                          ]);
                          setFlowError(null);
                          if (submitState === 'error') {
                            setSubmitState('idle');
                          }
                        }}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        <Plus className="h-4 w-4" />
                        Agregar servicio
                      </button>
                    </div>

                    {servicesState === 'loading' && (
                      <div className="mt-5 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        Cargando catálogo de servicios...
                      </div>
                    )}

                    {servicesError && (
                      <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                        {servicesError}
                      </div>
                    )}

                    {serviceItems.length === 0 ? (
                      <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                        Aún no has agregado servicios. Puedes continuar y
                        añadirlos más adelante si lo necesitas.
                      </div>
                    ) : (
                      <div className="mt-5 space-y-4">
                        {serviceItems.map((item, index) => (
                          <div
                            key={item.key}
                            className="rounded-2xl border border-slate-200 p-4"
                          >
                            <div className="mb-4 flex items-center justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold text-slate-800">
                                  Servicio {index + 1}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {serviceNameById.get(item.service_id) ??
                                    'Completa la información del servicio'}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  if (submitState === 'success') {
                                    clearGeneratedPreview();
                                  }
                                  setServiceItems((previous) =>
                                    previous.filter(
                                      (current) => current.key !== item.key,
                                    ),
                                  );
                                  setFlowError(null);
                                  if (submitState === 'error') {
                                    setSubmitState('idle');
                                  }
                                }}
                                className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Quitar
                              </button>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                              <LabeledField label="Servicio" required>
                                <Select
                                  variant="md"
                                  className="w-full"
                                  value={item.service_id}
                                  onChange={(event) =>
                                    handleServiceItemChange(
                                      item.key,
                                      'service_id',
                                      event.target.value,
                                    )
                                  }
                                >
                                  <option value="">
                                    Selecciona un servicio
                                  </option>
                                  {services.map((service) => (
                                    <option key={service.id} value={service.id}>
                                      {service.name}
                                    </option>
                                  ))}
                                </Select>
                              </LabeledField>

                              <LabeledField label="Moneda" required>
                                <Select
                                  variant="md"
                                  className="w-full"
                                  value={item.currency}
                                  onChange={(event) =>
                                    handleServiceItemChange(
                                      item.key,
                                      'currency',
                                      event.target.value,
                                    )
                                  }
                                >
                                  {CURRENCY_OPTIONS.map((currency) => (
                                    <option key={currency} value={currency}>
                                      {currency}
                                    </option>
                                  ))}
                                </Select>
                              </LabeledField>

                              <LabeledField label="Descripción">
                                <input
                                  type="text"
                                  value={item.description}
                                  onChange={(event) =>
                                    handleServiceItemChange(
                                      item.key,
                                      'description',
                                      event.target.value,
                                    )
                                  }
                                  placeholder="Detalle opcional"
                                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                />
                              </LabeledField>

                              <LabeledField label="Valor" required>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={item.value}
                                  onChange={(event) =>
                                    handleServiceItemChange(
                                      item.key,
                                      'value',
                                      event.target.value,
                                    )
                                  }
                                  placeholder="0.00"
                                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                />
                              </LabeledField>

                              <LabeledField label="Fecha de inicio" required>
                                <input
                                  type="date"
                                  value={item.start_date}
                                  onChange={(event) =>
                                    handleServiceItemChange(
                                      item.key,
                                      'start_date',
                                      event.target.value,
                                    )
                                  }
                                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                />
                              </LabeledField>

                              <LabeledField label="Fecha de fin" required>
                                <input
                                  type="date"
                                  value={item.end_date}
                                  onChange={(event) =>
                                    handleServiceItemChange(
                                      item.key,
                                      'end_date',
                                      event.target.value,
                                    )
                                  }
                                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                />
                              </LabeledField>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {flow === 'folder' && (
                <div className="mx-auto flex h-full w-full max-w-5xl flex-col overflow-y-auto pr-1">
                  <StepHeading
                    currentStep={currentWizardStep}
                    description="Elige la carpeta donde quieres guardar el contrato generado."
                    title="Carpeta destino"
                    totalSteps={wizardSteps.length}
                  />

                  {flowError && (
                    <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {flowError}
                    </div>
                  )}

                  <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-5">
                      <h3 className="text-lg font-semibold text-slate-900">
                        Ubicación del contrato
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Si no eliges una carpeta, el contrato quedará disponible
                        en la vista general.
                      </p>
                    </div>

                    {availableFolders.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                        Aún no hay carpetas disponibles. El contrato se guardará
                        sin carpeta.
                      </div>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_260px]">
                        <LabeledField label="Carpeta destino">
                          <Select
                            variant="md"
                            className="w-full"
                            value={folderId ?? ''}
                            onChange={(event) => {
                              if (submitState === 'success') {
                                clearGeneratedPreview();
                              }
                              setFolderId(
                                event.target.value
                                  ? Number(event.target.value)
                                  : null,
                              );
                              setFlowError(null);
                              if (submitState === 'error') {
                                setSubmitState('idle');
                              }
                            }}
                          >
                            <option value="">Sin carpeta</option>
                            {availableFolders.map((folder) => (
                              <option key={folder.id} value={folder.id}>
                                {folder.name}
                              </option>
                            ))}
                          </Select>
                        </LabeledField>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                            Selección actual
                          </p>
                          <p className="mt-2 text-base font-semibold text-slate-900">
                            {selectedFolderName ?? 'Sin carpeta'}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            Puedes cambiar esta ubicación más adelante si lo
                            necesitas.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {flow === 'fill-template' && selectedTemplate && (
                <div className="grid h-full min-h-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.667fr)]">
                  <section className="flex min-h-0 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 px-5 py-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                            {selectedTemplate.document_type === 'COMPANY' ? (
                              <Building2 className="h-5 w-5" />
                            ) : (
                              <User className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                              Datos del contrato
                            </h2>
                            <p className="text-xs text-slate-500">
                              {selectedTemplate.name}
                            </p>
                          </div>
                        </div>

                        {requiredFieldsCount > 0 && (
                          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                            <span className="text-xs text-slate-500">
                              Obligatorios:
                            </span>
                            <span className="text-sm font-bold text-slate-900">
                              {completedRequiredFieldsCount}/
                              {requiredFieldsCount}
                            </span>
                          </div>
                        )}
                      </div>

                      {sectionTimelineItems.length > 0 && (
                        <div className="mt-3 rounded-2xl bg-slate-50 px-4 py-3">
                          <FieldSectionHorizontalStepper
                            activeId={currentSectionItem?.id ?? null}
                            items={sectionTimelineItems}
                            onSelect={(id) => {
                              const idx = sectionTimelineItems.findIndex(
                                (item) => item.id === id,
                              );
                              if (idx !== -1) {
                                setFlowError(null);
                                setCurrentSectionIndex(idx);
                              }
                            }}
                          />
                        </div>
                      )}

                      {flowError && (
                        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                          {flowError}
                        </div>
                      )}

                      {submitState === 'success' && generatedDocument && (
                        <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-900">
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                            <div>
                              <p className="font-semibold">
                                Contrato generado correctamente
                              </p>
                              <p className="mt-1 text-emerald-800">
                                Revisa el PDF y luego guarda para cerrar este
                                flujo.
                              </p>
                              <p className="mt-1 text-emerald-800">
                                {generatedDocument.type +
                                  ' - ' +
                                  generatedDocument.client}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
                      {sectionTimelineItems.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                          Esta plantilla no necesita datos adicionales. Genera
                          el contrato cuando estés listo.
                        </div>
                      ) : currentSectionItem ? (
                        <div>
                          <h3 className="mb-5 text-base font-semibold text-slate-800">
                            {currentSectionItem.title}
                          </h3>

                          {isCurrentSectionOperational ? (
                            <LabeledField label={operationalNameLabel} required>
                              <input
                                type="text"
                                value={partyName}
                                onChange={(event) => {
                                  if (submitState === 'success')
                                    clearGeneratedPreview();
                                  setPartyName(event.target.value);
                                  setIsOperationalFieldSaved(false);
                                  setFlowError(null);
                                  if (submitState === 'error')
                                    setSubmitState('idle');
                                }}
                                placeholder={operationalNamePlaceholder}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                              />
                            </LabeledField>
                          ) : currentFieldSection ? (
                            <div className="grid gap-4 md:grid-cols-2">
                              {currentFieldSection.fields.map((field) => {
                                const fieldType = normalizeTemplateFieldType(
                                  field.type,
                                );
                                const value = fieldValues[field.key];

                                if (fieldType === 'boolean') {
                                  return (
                                    <div
                                      key={field.key}
                                      className="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3"
                                    >
                                      <label className="flex items-center justify-between gap-4">
                                        <div>
                                          <p className="text-sm font-medium text-slate-800">
                                            {field.label}
                                            {field.required && (
                                              <span className="ml-1 text-red-500">
                                                *
                                              </span>
                                            )}
                                          </p>
                                          <p className="mt-1 text-xs text-slate-500">
                                            {
                                              TEMPLATE_FIELD_TYPE_LABELS[
                                                fieldType
                                              ]
                                            }
                                          </p>
                                        </div>
                                        <input
                                          type="checkbox"
                                          checked={value === true}
                                          onChange={(event) =>
                                            handleDynamicFieldChange(
                                              field.key,
                                              event.target.checked,
                                            )
                                          }
                                          className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                                        />
                                      </label>
                                    </div>
                                  );
                                }

                                if (shouldUseTextarea(field)) {
                                  return (
                                    <LabeledField
                                      key={field.key}
                                      label={field.label}
                                      required={field.required}
                                    >
                                      <textarea
                                        rows={3}
                                        value={
                                          typeof value === 'string' ? value : ''
                                        }
                                        onChange={(event) =>
                                          handleDynamicFieldChange(
                                            field.key,
                                            event.target.value,
                                          )
                                        }
                                        placeholder={getFieldPlaceholder(field)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                      />
                                    </LabeledField>
                                  );
                                }

                                return (
                                  <LabeledField
                                    key={field.key}
                                    label={field.label}
                                    required={field.required}
                                  >
                                    <input
                                      type={
                                        fieldType === 'date'
                                          ? 'date'
                                          : fieldType === 'time'
                                            ? 'time'
                                            : fieldType === 'number'
                                              ? 'number'
                                              : 'text'
                                      }
                                      value={
                                        typeof value === 'string' ? value : ''
                                      }
                                      onChange={(event) =>
                                        handleDynamicFieldChange(
                                          field.key,
                                          event.target.value,
                                        )
                                      }
                                      placeholder={getFieldPlaceholder(field)}
                                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                    />
                                  </LabeledField>
                                );
                              })}
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>

                    <div className="shrink-0 border-t border-slate-200 bg-white px-5 py-4">
                      <div className="flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={handleSectionPrevious}
                          disabled={submitState === 'loading'}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Anterior
                        </button>

                        {isLastSection ? (
                          <button
                            type="button"
                            onClick={() => {
                              void handleGenerateOnLastSection();
                            }}
                            disabled={
                              submitState === 'loading' ||
                              Boolean(generationValidationError)
                            }
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {submitState === 'loading' ? (
                              <>
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                                Generando...
                              </>
                            ) : (
                              <>
                                <FileText className="h-4 w-4" />
                                Generar contrato
                              </>
                            )}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={handleSectionNext}
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                          >
                            Siguiente
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </section>

                  <section className="flex min-h-0 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-sm">
                    <div className="border-b border-slate-200 bg-white px-4 py-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-900">
                          {submitState === 'success'
                            ? 'Previsualización'
                            : 'Resumen'}
                        </p>
                        {previewUrl && (
                          <a
                            href={previewUrl}
                            rel="noreferrer"
                            target="_blank"
                            className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                          >
                            Abrir
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto p-4">
                      {submitState === 'success' &&
                      generatedDocument &&
                      previewUrl ? (
                        <div className="h-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                          <iframe
                            key={previewUrl}
                            title={`Vista previa de ${generatedDocument.type} - ${generatedDocument.client}`}
                            src={previewUrl}
                            className="h-full min-h-0 w-full bg-white"
                          />
                        </div>
                      ) : submitState === 'loading' ? (
                        <div className="flex h-full flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-slate-300 bg-white px-6 text-center">
                          <LoaderCircle className="h-10 w-10 animate-spin text-blue-600" />
                          <div>
                            <p className="text-base font-medium text-slate-800">
                              Generando el documento
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                              Preparando el PDF para su revisión...
                            </p>
                          </div>
                        </div>
                      ) : submitState === 'error' && flowError ? (
                        <div className="flex h-full flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-red-200 bg-white px-6 text-center">
                          <FileText className="h-10 w-10 text-red-400" />
                          <div>
                            <p className="text-base font-medium text-slate-800">
                              Error al generar
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                              {flowError}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-slate-300 bg-white px-6 text-center">
                          <FileText className="h-10 w-10 text-slate-300" />
                          <div>
                            <p className="text-base font-medium text-slate-800">
                              La previsualización aparecerá aquí
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                              Completa las secciones y usa el botón{' '}
                              <span className="font-medium text-slate-700">
                                Generar contrato
                              </span>{' '}
                              para ver el PDF.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                </div>
              )}
            </div>

            <div className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-100 px-7 py-4">
              <button
                type="button"
                onClick={handleSecondaryAction}
                disabled={submitState === 'loading'}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
              >
                <ArrowLeft className="h-4 w-4" />
                {secondaryButtonLabel}
              </button>

              {flow === 'fill-template' ? (
                submitState === 'success' && generatedDocument ? (
                  <button
                    type="button"
                    onClick={handleSaveGeneratedContract}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-blue-500/25"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Guardar contrato
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSaveCurrentSection}
                    disabled={submitState === 'loading'}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Guardar
                  </button>
                )
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    void handlePrimaryAction();
                  }}
                  disabled={primaryButtonDisabled}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-blue-500/25 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <ArrowRight className="h-4 w-4" />
                  {primaryButtonLabel}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
