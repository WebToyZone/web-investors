import {
  FaChartLine,
  FaEnvelope,
  FaFilePdf,
  FaPeopleGroup,
  FaRocket,
  FaVideo,
} from 'react-icons/fa6';
import type { AdminSection } from './types';

export const adminSections: AdminSection[] = [
  {
    id: 'documents',
    label: 'Documentos',
    eyebrow: 'Subida y publicacion',
    description: 'PDFs, categorias, anos, idiomas y estados de publicacion.',
    icon: FaFilePdf,
  },
  {
    id: 'glance',
    label: 'KPIs / At a Glance',
    eyebrow: 'Cifras visibles',
    description: 'Indicadores, iconos y ubicaciones operativas.',
    icon: FaChartLine,
  },
  {
    id: 'board',
    label: 'Board',
    eyebrow: 'Gobierno corporativo',
    description: 'Miembros, cargos, fotos y asientos pendientes.',
    icon: FaPeopleGroup,
  },
  {
    id: 'growth',
    label: 'Growth Journey',
    eyebrow: 'Ingresos e hitos',
    description: 'Grafico anual, milestones y textos de crecimiento.',
    icon: FaRocket,
  },
  {
    id: 'contact',
    label: 'Contacto',
    eyebrow: 'Formulario y datos',
    description: 'Datos de contacto, labels, mensajes y consentimiento.',
    icon: FaEnvelope,
  },
  {
    id: 'videos',
    label: 'Videos',
    eyebrow: 'Media de fondo',
    description: 'Video del Hero y de Power of a Smile.',
    icon: FaVideo,
  },
];
