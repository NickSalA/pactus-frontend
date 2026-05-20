'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { deleteDocument, getServices } from '@/api';
import { getDocumentFileUrl, normalizeDocument } from '@/api/documents';
import { generateContractFromTemplate, getTemplates } from '@/api/templates';
import {
  getAllTemplateFields,
  getTemplateOperationalFields,
  normalizeTemplateFieldType,
} from '@/lib/templateFields';
import { useAuthStore } from '@/store';
import {
  getDefaultWritableDocumentType,
  getWritableDocumentTypes,
} from '@/lib/permissions';
import type { DocumentFlatten } from '@/types/ui.types';
import type {
  ApiCurrencyType,
  ApiDocumentServiceItemRequest,
  ApiDocumentType,
  ApiTemplateField,
  ApiTemplateResponse,
  ApiServiceResponse,
} from '@/types/api';
import type { ContractFolder } from '@/features/contracts/lib/contracts-utils';
import type { FieldSectionNavItem } from '@/features/contracts/types/FieldSectionNavItem';

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
  title: (documentType: ApiDocumentType) => string;
};

type FieldSection = {
  fields: ApiTemplateField[];
  id: string;
  title: string;
};

export type UseContractGenerationOptions = {
  availableFolders?: readonly ContractFolder[];
  defaultFolderId?: number | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (contract: DocumentFlatten) => void;
};

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
  documentType: ApiDocumentType,
): 'cliente_nombre' | 'trabajador_nombre' => {
  return documentType === 'COMPANY' ? 'cliente_nombre' : 'trabajador_nombre';
};

const getOperationalNameLabel = (documentType: ApiDocumentType): string => {
  return documentType === 'COMPANY'
    ? 'Nombre del cliente'
    : 'Nombre del trabajador';
};

const getOperationalNamePlaceholder = (
  documentType: ApiDocumentType,
): string => {
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

export function useContractGeneration({
  availableFolders = [],
  defaultFolderId = null,
  open,
  onClose,
  onSubmit,
}: UseContractGenerationOptions) {
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
    useState<ApiDocumentType>(defaultDocumentType);
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

  const clearGeneratedPreview = useCallback(() => {
    if (generatedDocument) {
      void deleteDocument(generatedDocument.id).catch(() => undefined);
    }

    setSubmitState('idle');
    setFlowError(null);
    setPreviewUrl(null);
    setGeneratedDocument(null);
  }, [generatedDocument]);

  const handleClose = useCallback(() => {
    if (generatedDocument) {
      void deleteDocument(generatedDocument.id).catch(() => undefined);
    }

    onClose();
    window.setTimeout(() => {
      resetModal();
    }, 300);
  }, [generatedDocument, onClose, resetModal]);

  const handleDocumentTypeChange = useCallback(
    (documentType: ApiDocumentType) => {
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
    },
    [],
  );

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

  const handleSelectAction = useCallback((action: WizardAction) => {
    setSelectedAction(action);
    setFlowError(null);
  }, []);

  const addServiceItem = useCallback(() => {
    if (submitState === 'success') {
      clearGeneratedPreview();
    }
    setServiceItems((previous) => [...previous, createEmptyServiceItem()]);
    setFlowError(null);
    if (submitState === 'error') {
      setSubmitState('idle');
    }
  }, [clearGeneratedPreview, submitState]);

  const removeServiceItem = useCallback(
    (key: string) => {
      if (submitState === 'success') {
        clearGeneratedPreview();
      }
      setServiceItems((previous) =>
        previous.filter((current) => current.key !== key),
      );
      setFlowError(null);
      if (submitState === 'error') {
        setSubmitState('idle');
      }
    },
    [clearGeneratedPreview, submitState],
  );

  const handleFolderChange = useCallback(
    (value: string) => {
      if (submitState === 'success') {
        clearGeneratedPreview();
      }
      setFolderId(value ? Number(value) : null);
      setFlowError(null);
      if (submitState === 'error') {
        setSubmitState('idle');
      }
    },
    [clearGeneratedPreview, submitState],
  );

  const handlePartyNameChange = useCallback(
    (value: string) => {
      if (submitState === 'success') clearGeneratedPreview();
      setPartyName(value);
      setIsOperationalFieldSaved(false);
      setFlowError(null);
      if (submitState === 'error') setSubmitState('idle');
    },
    [clearGeneratedPreview, submitState],
  );

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

  const handleStepperSelect = useCallback(
    (id: string) => {
      const idx = sectionTimelineItems.findIndex((item) => item.id === id);
      if (idx !== -1) {
        setFlowError(null);
        setCurrentSectionIndex(idx);
      }
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

  const handleBackFromUpload = useCallback(() => {
    setFlowError(null);
    setFlow('select-action');
  }, []);

  const primaryButtonDisabled =
    flow === 'select-action'
      ? !selectedAction
      : flow === 'select-template'
        ? templatesState === 'loading' || !selectedTemplate
        : false;

  const primaryButtonLabel = 'Continuar';

  const secondaryButtonLabel =
    flow === 'select-action' ? 'Cancelar' : 'Anterior';

  return {
    addServiceItem,
    allowedDocumentTypes,
    canChooseDocumentType,
    clearGeneratedPreview,
    completedRequiredFieldsCount,
    currentFieldSection,
    currentSectionItem,
    currentWizardStep,
    fieldValues,
    flow,
    flowError,
    folderId,
    generatedDocument,
    generationValidationError,
    handleBackFromUpload,
    handleClose,
    handleDocumentTypeChange,
    handleDynamicFieldChange,
    handleFolderChange,
    handleGenerateOnLastSection,
    handlePartyNameChange,
    handlePrimaryAction,
    handleSaveCurrentSection,
    handleSaveGeneratedContract,
    handleSecondaryAction,
    handleSectionNext,
    handleSectionPrevious,
    handleSelectAction,
    handleSelectTemplate,
    handleServiceItemChange,
    handleStepperSelect,
    isCurrentSectionOperational,
    isLastSection,
    operationalNameLabel,
    operationalNamePlaceholder,
    partyName,
    previewUrl,
    primaryButtonDisabled,
    primaryButtonLabel,
    removeServiceItem,
    requiredFieldsCount,
    secondaryButtonLabel,
    sectionTimelineItems,
    selectedAction,
    selectedDocumentType,
    selectedFolderName,
    selectedTemplate,
    selectedTemplateId,
    serviceItems,
    serviceNameById,
    services,
    servicesError,
    servicesState,
    showServicesStep,
    submitState,
    templatesError,
    templatesState,
    visibleTemplates,
    wizardSteps,
  };
}
