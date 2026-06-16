import {
  BarChart3,
  BellRing,
  Bot,
  BrainCircuit,
  Building2,
  DatabaseZap,
  Eye,
  FileStack,
  FileText,
  FolderSync,
  Linkedin,
  LockKeyhole,
  Mail,
  MapPin,
  MessagesSquare,
  Phone,
  ShieldCheck,
  Target,
  UsersRound,
} from 'lucide-react';

export const navItems = [
  { href: '#quienes-somos', label: 'Quiénes somos' },
  { href: '#mision-vision', label: 'Misión y visión' },
  { href: '#capacidades', label: 'Capacidades' },
  { href: '#ia-rag', label: 'IA RAG' },
  { href: '#contacto', label: 'Contacto' },
] as const;

export const heroHighlights = [
  'Gestión contractual',
  'Agente IA con RAG',
  'Control por roles',
] as const;

export const aboutHighlights = [
  {
    icon: FileText,
    title: 'Ciclo contractual completo',
    description:
      'Desde la ingesta documental hasta el análisis, consulta y generación de contratos.',
  },
  {
    icon: ShieldCheck,
    title: 'Control organizacional',
    description:
      'Datos separados por organización, permisos por rol y acceso seguro a documentos.',
  },
  {
    icon: Building2,
    title: 'Enfoque empresarial',
    description:
      'Diseñado para contratos laborales, empresariales y operación legal de alto impacto.',
  },
];

export const missionVisionItems = [
  {
    icon: Target,
    title: 'Misión',
    description:
      'Simplificar y automatizar la gestión contractual con IA, reduciendo trabajo manual y entregando información legal útil, segura y trazable para cada organización.',
  },
  {
    icon: Eye,
    title: 'Visión',
    description:
      'Convertirnos en una plataforma confiable para administrar contratos empresariales y laborales con precisión legal, seguridad basada en identidad y análisis inteligente.',
  },
];

export const capabilities = [
  {
    icon: BarChart3,
    title: 'Dashboard ejecutivo',
    description:
      'Métricas, documentos recientes, acciones rápidas y vistas para contratos empresariales y laborales.',
  },
  {
    icon: FileText,
    title: 'Gestión de contratos',
    description:
      'Creación, edición, estados, carpetas, filtros, carga de PDF e importación documental.',
  },
  {
    icon: Bot,
    title: 'Agente IA',
    description:
      'Chat conversacional para consultar contratos en lenguaje natural con respuestas fundamentadas.',
  },
  {
    icon: FileStack,
    title: 'Plantillas inteligentes',
    description:
      'Campos dinámicos, generación de borradores con IA, previsualización y exportación a PDF.',
  },
  {
    icon: UsersRound,
    title: 'Administración',
    description:
      'Usuarios, roles, permisos, servicios, carpetas, auditoría y configuración organizacional.',
  },
  {
    icon: BellRing,
    title: 'Alertas y notificaciones',
    description:
      'Reglas para vencimientos próximos, emails consolidados y seguimiento de eventos relevantes.',
  },
  {
    icon: ShieldCheck,
    title: 'Seguridad y roles',
    description:
      'Aislamiento por organización, autenticación moderna y acceso filtrado según permisos.',
  },
  {
    icon: FolderSync,
    title: 'Google Drive',
    description:
      'Importación de contratos desde Drive con procesamiento, extracción e indexación en segundo plano.',
  },
];

export const ragFlow = [
  { icon: MessagesSquare, label: 'Pregunta del usuario' },
  { icon: DatabaseZap, label: 'Búsqueda RAG' },
  { icon: BrainCircuit, label: 'Contexto contractual' },
  { icon: LockKeyhole, label: 'Respuesta fundamentada' },
];

export const ragFeatures = [
  'Búsqueda semántica sobre contratos cargados',
  'Respuestas contextualizadas y trazables',
  'Citas o referencias a documentos fuente',
  'Filtrado por permisos y rol del usuario',
  'Memoria conversacional para mantener contexto',
  'Visualizaciones dinámicas para datos estructurados',
];

export const contactItems = [
  {
    icon: Mail,
    label: 'nicksalcedo717@gmail.com',
    href: 'mailto:nicksalcedo717@gmail.com',
  },
  { icon: Phone, label: '+51 991 258 717', href: 'tel:+51991258717' },
  { icon: MapPin, label: 'Lima, Perú', href: null },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/nick-salcedo-alfaro-42972925a/',
  },
];

export const footerLinks = [
  { href: '/login', label: 'Iniciar sesión' },
  { href: '/privacy-policy', label: 'Política de Privacidad' },
  { href: '/terms-of-service', label: 'Términos de Servicio' },
];
