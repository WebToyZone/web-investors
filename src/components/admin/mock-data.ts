import {
  FaChartLine,
  FaEnvelope,
  FaFilePdf,
  FaImage,
  FaLink,
  FaPeopleGroup,
  FaRocket,
} from 'react-icons/fa6';
import type {
  AdminSection,
  ContactField,
  FooterLink,
  MediaAsset,
} from './types';

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
    id: 'navigation',
    label: 'Footer y navegacion',
    eyebrow: 'Enlaces globales',
    description: 'Menu superior, footer, legales y redes sociales.',
    icon: FaLink,
  },
  {
    id: 'assets',
    label: 'Hero / assets',
    eyebrow: 'Media library',
    description: 'Videos, imagenes, logos, decoraciones y documentos.',
    icon: FaImage,
  },
];

export const contactFields: ContactField[] = [
  { label: 'Email publico', value: 'investors@eolo.com' },
  { label: 'Telefono', value: '+34 984 017 888' },
  { label: 'Direccion linea 1', value: 'C/Menendez Valdes 40 2D' },
  { label: 'CTA formulario', value: 'Send it! / Enviar' },
];

export const footerLinks: FooterLink[] = [
  {
    id: 1,
    group: 'Investor Centre',
    label: 'Growth Journey',
    href: '#growth-journey',
    locale: 'en',
  },
  {
    id: 2,
    group: 'Documents',
    label: 'Investors Documents',
    href: '#documents',
    locale: 'en',
  },
  {
    id: 3,
    group: 'Centro de Inversores',
    label: 'Trayectoria',
    href: '#growth-journey',
    locale: 'es',
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
