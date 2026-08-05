import {
  FaChartLine,
  FaEnvelope,
  FaFilePdf,
  FaPeopleGroup,
  FaRocket,
  FaUserGear,
  FaVideo,
} from 'react-icons/fa6';
import type { AdminSection } from './types';

export const adminSections: AdminSection[] = [
  {
    id: 'documents',
    label: 'Documentos',
    eyebrow: 'Subida y publicación',
    description:
      'PDF, Excel y CSV, categorías, años, idiomas y estados de publicación.',
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
    description: 'Gráfico anual, hitos y textos de crecimiento.',
    icon: FaRocket,
  },
  {
    id: 'contact',
    label: 'Contacto',
    eyebrow: 'Formulario y datos',
    description: 'Datos de contacto, etiquetas, mensajes y consentimiento.',
    icon: FaEnvelope,
  },
  {
    id: 'videos',
    label: 'Videos',
    eyebrow: 'Media de fondo',
    description: 'Vídeo del Hero y de Power of a Smile.',
    icon: FaVideo,
  },
  {
    id: 'users',
    label: 'Usuarios',
    eyebrow: 'Accesos al admin',
    description: 'Agrega, edita y elimina usuarios con acceso al panel.',
    icon: FaUserGear,
  },
];
