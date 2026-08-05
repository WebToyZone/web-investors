// src/data/investors.ts

import type { HeroVideo } from '@/components/sections/HeroSection';
import type { NavbarLogo } from '@/components/layout/Navbar';
import type { GrowthJourneyContent } from '@/components/sections/GrowthJourneySection';
import type { BusinessModelContent } from '@/components/sections/BusinessModelSection';
import type { GlanceContent } from '@/components/sections/EoloAtAGlanceSection';
import type { BoardContent } from '@/components/sections/BoardOfDirectorsSection';
import type { PowerOfASmileContent } from '@/components/sections/PowerOfASmileSection';
import type { DocumentsContent } from '@/components/sections/DocumentsSection';
import type { ContactContent } from '@/components/sections/ContactSection';
import type { FooterContent } from '@/components/layout/Footer';
import { FaLinkedinIn, FaInstagram, FaYoutube } from 'react-icons/fa6';

export type Locale = 'en' | 'es';

export interface InvestorsPageContent {
  navbar: {
    logo: NavbarLogo;
  };
  hero: HeroVideo;
  growthJourney: GrowthJourneyContent;
  growthDecoration: { src: string; alt: string };
  businessModel: BusinessModelContent;
  cockpitBand: { src: string; alt: string };
  glance: GlanceContent;
  board: BoardContent;
  powerOfASmile: PowerOfASmileContent;
  documents: DocumentsContent;
  contact: ContactContent;
  contactDecoration: { src: string; alt: string };
  footer: FooterContent;
}

const enContent: InvestorsPageContent = {
  navbar: {
    logo: { src: '/logo-eolo.webp', alt: 'EOLO - keep smiling!' },
  },

  hero: {
    src: '/video/hero.webm',
    type: 'video/webm',
    poster: '/video/hero-poster.jpg',
    alt: 'A child flying a red kite on a hilltop at sunset.',
  },

  growthJourney: {
    title: 'Growth Journey',
    period: '2020 - 2025',
    lead: 'From an international family-owned company to a selective growth and M&A platform.',
    body: 'EOLO has grown and transformed without losing its DNA: Speed, creativity, a debt-free structure, a strong B2B focus, and a lean operating model.',
    chart: {
      caption: '*Consolidated Revenue',
      // Bars and timeline come from `getPublicGrowth`; the page overwrites
      // whatever is here, so leaving data would only invite someone to edit it
      // and wonder why nothing changes.
      data: [],
    },
    milestones: [],
  },

  growthDecoration: { src: '/decorations/kite.webp', alt: '' },

  businessModel: {
    accent: 'Unique',
    title: 'Business Model',
    accentPosition: 'start',
    // subtitle:
    //   'A scalable operating platform designed to maximize flexibility, speed-to-market and capital efficiency.',
    // accentSubtitle: 'Breaking the mold of the toy industry.',
    accentSubtitle: 'EOLO is breaking the mold of the toy industry',
    subtitle:
      'with a lighter, faster, and more flexible operating model, turning adaptability into a competitive advantage.',
    features: [
      {
        title: 'Asset-Light',
        description:
          'No owned factories and no heavy CAPEX requirements. Investment is focused on design, product development, brands, sourcing, and customer relationships.',
      },
      {
        title: 'JIT/Low Inventory',
        description:
          'Production aligned with demand and market trends, reducing overstock risk, obsolescence, and liquidation exposure.',
      },
      {
        title: 'FOB China',
        description:
          'Direct-from-origin delivery, improved cash flow efficiency, and reduced need for proprietary inventory.',
      },
      {
        title: 'Speed',
        description:
          'The ability to identify emerging trends and rapidly transform them into commercially viable products.',
      },
    ],
  },

  cockpitBand: { src: '/decorations/cockpit.webp', alt: '' },

  glance: {
    accent: 'Eolo',
    title: 'at a Glance 2025',
    subtitle:
      'A global toy platform with nearly 50 years of experience, operating across 59 countries and serving leading retailers worldwide.',
    // The KPI cards and the operating locations now come from the database:
    // see `getPublicGlance`, which the page merges over this content. Only the
    // headings below are still copy that lives here.
    stats: [],
    platform: {
      heading: 'Global Operating Platform',
      locations: [],
    },
  },

  board: {
    accent: 'Directors',
    title: 'Board of',
    subtitle:
      'Corporate governance designed for the next phase of growth: public markets, M&A, investors and international expansion.',
    // Members and empty seats come from `getPublicBoard`.
    members: [],
    pending: [],
  },

  powerOfASmile: {
    heading: 'The Power of a Smile',
    video: {
      src: '/video/video.webm',
      type: 'video/webm',
      poster: '/video/smile-poster.jpg',
      alt: 'A red gift box opening to reveal a glowing light.',
    },
  },

  documents: {
    accent: 'Documents',
    // Columns come from `getPublicDocuments`.
    columns: [],
  },

  contact: {
    accent: 'Contact Us',
    labels: {
      heading: 'We are here to help',
      subtitle:
        'For investor inquiries, financial information and shareholder communications.',
      name: 'Name and Lastname *',
      phone: 'Phone *',
      email: 'Email *',
      message: 'Message *',
      consent: 'I have read and agree all our Terms and Conditions.',
      submit: 'Send it!',
    },
    info: {
      email: 'investors@eolo.com',
      phone: '+34 984 017 888',
      addressLines: [
        'C/Menéndez Valdés 40 2ºD',
        '33202, Gijón, Asturias, SPAIN.',
      ],
    },
  },

  contactDecoration: { src: '/decorations/ufo.webp', alt: '' },

  footer: {
    logo: { src: '/logo-eolo-white.webp', alt: 'EOLO - keep smiling!' },
    groups: [
      {
        title: 'Investor Centre',
        links: [
          { label: 'Growth Journey', href: '#growth-journey' },
          { label: 'Business Model', href: '#eolo-at-a-glance' },
          { label: 'Eolo at a Glance', href: '#eolo-at-a-glance' },
          { label: 'Boards of Directors', href: '#board-of-directors' },
        ],
      },
      {
        title: 'Documents',
        links: [
          { label: 'Financial Information', href: '#documents' },
          { label: 'Meetings & Notices', href: '#documents' },
          { label: 'Investors Documents', href: '#documents' },
        ],
      },
    ],
    social: {
      title: 'Follow Us',
      links: [
        {
          label: 'LinkedIn',
          href: 'https://www.linkedin.com/',
          icon: FaLinkedinIn,
        },
        {
          label: 'Instagram',
          href: 'https://www.instagram.com/',
          icon: FaInstagram,
        },
        {
          label: 'YouTube',
          href: 'https://www.youtube.com/',
          icon: FaYoutube,
        },
      ],
    },
    copyright:
      'Eolo © 2026 | All Rights Reserved. All trademarks, including names, characters, images and logos, are protected by trademarks, copyrights and other Intellectual Property rights owned by Eolo or its subsidiaries, licensors and licensees.',
    legalLinks: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Cookie policy', href: '/cookie-policy' },
      { label: 'Legal notice', href: '/legal-notice' },
    ],
  },
};

const esContent: InvestorsPageContent = {
  ...enContent,

  growthJourney: {
    ...enContent.growthJourney,
    title: 'Trayectoria',
    lead: 'De una empresa familiar internacional a una plataforma de crecimiento selectivo y M&A.',
    body: 'EOLO ha crecido y se ha transformado sin perder su ADN: velocidad, creatividad, estructura sin deuda, fuerte enfoque B2B y un modelo operativo ágil.',
    chart: {
      ...enContent.growthJourney.chart,
      caption: '*Ingresos consolidados',
    },
    milestones: [],
  },

  businessModel: {
    ...enContent.businessModel,
    accent: 'Único',
    title: 'Modelo de negocio',
    accentPosition: 'end',
    // subtitle:
    //   'Una plataforma operativa escalable diseñada para maximizar la flexibilidad, la velocidad de salida al mercado y la eficiencia de capital.',
    //   accentSubtitle: 'Rompiendo el molde de la industria del juguete.',
    subtitle:
      'con un modelo más ligero, ágil y flexible, transformando la adaptación al mercado en una ventaja competitiva.',
    accentSubtitle: 'EOLO rompe el molde de la industria del juguete',
    features: [
      {
        title: 'Asset-Light',
        description:
          'Sin fábricas propias ni grandes necesidades de CAPEX. La inversión se centra en diseño, desarrollo de producto, marcas, sourcing y relaciones con clientes.',
      },
      {
        title: 'JIT / Bajo inventario',
        description:
          'Producción alineada con la demanda y las tendencias del mercado, reduciendo el riesgo de sobrestock, obsolescencia y liquidación.',
      },
      {
        title: 'FOB China',
        description:
          'Entrega directa desde origen, mayor eficiencia de flujo de caja y menor necesidad de inventario propio.',
      },
      {
        title: 'Velocidad',
        description:
          'Capacidad para identificar tendencias emergentes y transformarlas rápidamente en productos comercialmente viables.',
      },
    ],
  },

  glance: {
    ...enContent.glance,
    accent: 'EOLO',
    title: 'en un Vistazo 2025',
    subtitle:
      'Una plataforma global de juguetes con casi 50 años de experiencia, operando en 59 países y sirviendo a los principales minoristas del mundo.',
    stats: [],
    platform: {
      heading: 'Plataforma Operativa Global',
      locations: [],
    },
  },

  board: {
    accent: 'Directiva',
    title: 'Junta',
    subtitle:
      'Gobierno corporativo para la nueva etapa: mercado, M&A, inversores y escala internacional.',
    // Members and empty seats come from `getPublicBoard`.
    members: [],
    pending: [],
  },

  documents: {
    accent: 'Documentos',
    // Columns come from `getPublicDocuments`.
    columns: [],
  },

  contact: {
    accent: 'Contáctenos',
    labels: {
      heading: 'Estamos para ayudarle',
      subtitle:
        'Para consultas de inversores, información financiera y comunicaciones con accionistas.',
      name: 'Nombre y Apellido *',
      phone: 'Teléfono *',
      email: 'Correo Electrónico *',
      message: 'Mensaje *',
      consent: 'He leído y acepto todos nuestros Términos y Condiciones.',
      submit: '¡Enviar!',
    },
    info: {
      email: 'investors@eolo.com',
      phone: '+34 984 017 888',
      addressLines: [
        'C/Menéndez Valdés 40 2ºD',
        '33202, Gijón, Asturias, ESPAÑA.',
      ],
    },
  },

  footer: {
    logo: { src: '/logo-eolo-white.webp', alt: 'EOLO - keep smiling!' },
    groups: [
      {
        title: 'Centro de Inversores',
        links: [
          { label: 'Trayectoria', href: '#growth-journey' },
          { label: 'Modelo de Negocio', href: '#business-model' },
          { label: 'Eolo en un Vistazo', href: '#eolo-at-a-glance' },
          { label: 'Junta Directiva', href: '#board-of-directors' },
        ],
      },
      {
        title: 'Documentos',
        links: [
          { label: 'Información Financiera', href: '#documents' },
          { label: 'Juntas y Convocatorias', href: '#documents' },
          { label: 'Documentos para Inversores', href: '#documents' },
        ],
      },
    ],
    social: {
      title: 'Síguenos',
      links: [
        {
          label: 'LinkedIn',
          href: 'https://www.linkedin.com/',
          icon: FaLinkedinIn,
        },
        {
          label: 'Instagram',
          href: 'https://www.instagram.com/',
          icon: FaInstagram,
        },
        {
          label: 'YouTube',
          href: 'https://www.youtube.com/',
          icon: FaYoutube,
        },
      ],
    },
    copyright:
      'Eolo © 2026 | Todos los derechos reservados. Todas las marcas, incluidos nombres, personajes, imágenes y logotipos, están protegidos por marcas registradas, derechos de autor y otros derechos de propiedad intelectual propiedad de Eolo o sus subsidiarias, licenciantes y licenciatarios.',
    legalLinks: [
      { label: 'Política de Privacidad', href: '/privacy-policy' },
      { label: 'Política de Cookies', href: '/cookie-policy' },
      { label: 'Aviso Legal', href: '/legal-notice' },
    ],
  },
};

export async function getInvestorsPage(
  locale: Locale,
): Promise<InvestorsPageContent> {
  return locale === 'es' ? esContent : enContent;
}
