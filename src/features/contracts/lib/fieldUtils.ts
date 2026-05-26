import {
  getAllTemplateFields,
  getTemplateOperationalFields,
  normalizeTemplateFieldType,
} from '@/lib/templateFields';
import type { ApiDocumentType, ApiTemplateField } from '@/types/api';

export type FieldSectionDefinition = {
  id: string;
  keywords: readonly string[];
  title: (documentType: ApiDocumentType) => string;
};

export type FieldSection = {
  fields: ApiTemplateField[];
  id: string;
  title: string;
};

export const FIELD_SECTION_DEFINITIONS: readonly FieldSectionDefinition[] = [
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

export const LONG_TEXT_HINTS = [
  'direccion',
  'domicilio',
  'objeto',
  'descripcion',
  'detalle',
  'causas',
  'actividades',
  'alcance',
  'funciones',
] as const;

export const normalizeSearchText = (value: string): string => {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/_/g, ' ')
    .trim();
};

export const shouldUseTextarea = (field: ApiTemplateField): boolean => {
  const searchable = normalizeSearchText(`${field.key} ${field.label}`);
  return LONG_TEXT_HINTS.some((hint) => searchable.includes(hint));
};

export const getFieldPlaceholder = (field: ApiTemplateField): string => {
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

export const buildTemplateFieldSections = (
  template: { content: { fields: ApiTemplateField[]; operational_fields?: ApiTemplateField[] }; document_type: ApiDocumentType } | null,
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