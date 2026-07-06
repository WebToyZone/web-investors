import {
  FaChartLine,
  FaEnvelope,
  FaFilePdf,
  FaImage,
  FaPeopleGroup,
  FaRocket,
} from 'react-icons/fa6';
import type { AdminSection, MediaAsset } from './types';

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
    id: 'assets',
    label: 'Hero / assets',
    eyebrow: 'Media library',
    description: 'Videos, imagenes, logos, decoraciones y documentos.',
    icon: FaImage,
  },
];

export const mediaAssets: MediaAsset[] = [
  {
    id: 1,
    name: 'Hero video',
    type: 'video',
    usage: 'Hero',
    path: '/video/hero.webm',
    status: 'published',
  },
  {
    id: 2,
    name: 'Smile video',
    type: 'video',
    usage: 'Power of a Smile',
    path: '/video/video.webm',
    status: 'published',
  },
  {
    id: 3,
    name: 'EOLO logo red',
    type: 'image',
    usage: 'Navbar',
    path: '/logo-eolo.webp',
    status: 'published',
  },
];
