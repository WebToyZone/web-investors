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
    src: '/video/hero.mp4',
    type: 'video/mp4',
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
      data: [
        { year: '2020', value: 6.67, label: '$6.67' },
        { year: '2021', value: 6.65, label: '$6.65' },
        { year: '2022', value: 15.5, label: '$15.50' },
        { year: '2023', value: 13.17, label: '$13.17' },
        { year: '2024', value: 18.15, label: '$18.15' },
        { year: '2025', value: 19.75, label: '$19.75' },
      ],
    },
    milestones: [
      {
        title: '2020 - CuiCui Studios',
        description:
          'Expansion into technology, apps, and digital experiences.',
      },
      {
        title: '2021 - ToyZone',
        description:
          'Spin-off of our Development and Sourcing agency dedicated to the global toy industry.',
      },
      {
        title: '2022 - Scale Acceleration',
        description:
          'EOLO surpasses $15M in revenue and demonstrates its ability to scale.',
      },
      {
        title: '2024 - Strategic M&A',
        description:
          'YWow and Wicked expand the platform across games, pets, and outdoor categories.',
      },
    ],
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
    subtitle: 'with a lighter, faster, and more flexible operating model, turning adaptability into a competitive advantage.',
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
    stats: [
      {
        icon: { src: '/icons/toy-industry-experience.webp' },
        value: '~50 years',
        label: 'Toy Industry Experience',
      },
      {
        icon: { src: '/icons/revenue.webp' },
        value: '$19,75M',
        label: '2025 Revenue',
      },
      {
        icon: { src: '/icons/countries.webp' },
        value: '59',
        label: 'Countries',
      },
      { icon: { src: '/icons/clients.webp' }, value: '180', label: 'Clients' },
      {
        icon: { src: '/icons/direct-retailers.webp' },
        value: '125',
        label: 'Direct Retailers',
      },
      {
        icon: { src: '/icons/distributors.webp' },
        value: '55',
        label: 'Distributors',
      },
      {
        icon: { src: '/icons/storefronts.webp' },
        value: '33.000',
        label: 'Storefronts',
      },
      {
        icon: { src: '/icons/revenue-employee.webp' },
        value: '$681K',
        label: 'Revenue / Employee',
      },
    ],
    platform: {
      heading: 'Global Operating Platform',
      locations: [
        {
          icon: { src: '/icons/spain.webp' },
          name: 'Spain',
          description: 'Corporate, Product Development, Finance & Creativity.',
        },
        {
          icon: { src: '/icons/china.webp' },
          name: 'Hong Kong / China',
          description:
            'Sourcing, Manufacturing, Supplier Management & Quality Assurance.',
        },
        {
          icon: { src: '/icons/usa.webp' },
          name: 'United States',
          description: 'Commercial Scale, Retail & Expansion.',
        },
      ],
    },
  },

  board: {
    accent: 'Directors',
    title: 'Board of',
    subtitle:
      'Corporate governance designed for the next phase of growth: public markets, M&A, investors and international expansion.',
    members: [
      {
        name: 'Alex Prieto',
        role: 'President',
        description:
          'Co-Founder with 26 years of experience in the toy industry. Three-time Mojo Nation 100 honoree.',
        image: { src: '/board/alex-prieto.webp', alt: 'Alex Prieto' },
      },
      {
        name: 'Jose M. Diaz',
        role: 'Vice President',
        description:
          'Co-Founder with 20 years of experience in international toy sales management.',
        image: { src: '/board/jose-diaz.webp', alt: 'Jose M. Diaz' },
      },
      {
        name: 'Isabel Prieto',
        role: 'Proprietary Director',
        description:
          'Co-Founder with 20 years of experience in administration and human resources management.',
        image: { src: '/board/isabel-prieto.webp', alt: 'Isabel Prieto' },
      },
      {
        name: 'Rafael Prieto',
        role: 'Executive Director',
        description:
          'Co-Founder with 30 years of experience in toy production and international toy design.',
        image: { src: '/board/rafael-prieto.webp', alt: 'Rafael Prieto' },
      },
      {
        name: 'Jose A. Tuñón',
        role: 'Executive Director',
        description:
          'CFO with more than 25 years of experience in corporate restructuring and refinancing.',
        image: { src: '/board/jose-tunon.webp', alt: 'Jose A. Tuñón' },
      },
    ],
    pending: [
      { name: 'TBC', role: 'Secretary', image: { src: '/board/tbc.webp' } },
      {
        name: 'TBC',
        role: 'Financial Representative',
        image: { src: '/board/tbc.webp' },
      },
      {
        name: 'TBC',
        role: 'Industry Representative',
        image: { src: '/board/tbc.webp' },
      },
    ],
  },

  powerOfASmile: {
    heading: 'The Power of a Smile',
    video: {
      src: '/video/video.mp4',
      type: 'video/mp4',
      poster: '/video/smile-poster.jpg',
      alt: 'A red gift box opening to reveal a glowing light.',
    },
  },

  documents: {
    accent: 'Documents',
    columns: [
      {
        title: 'Financial Information',
        per_year: [{ year: '2026', documents: [] }],
      },
      {
        title: 'Meetings & Notices',
        per_year: [{ year: '2026', documents: [] }],
      },
      {
        title: 'Investors Documents',
        per_year: [
          {
            year: '2026',
            documents: [
              {
                title: 'BME Scaleup Market Admission Document',
                date: '01/07/2026',
                format: 'PDF',
                size: '8.4 MB',
                href: '/docs/bme-scaleup-market-admission.pdf',
              },
            ],
          },
        ],
      },
    ],
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
    milestones: [
      {
        title: '2020 - CuiCui Studios',
        description:
          'Expansión hacia tecnología, apps y experiencias digitales.',
      },
      {
        title: '2021 - ToyZone',
        description:
          'Spin-off de nuestra agencia de desarrollo y sourcing dedicada al sector global del juguete.',
      },
      {
        title: '2022 - Aceleración de escala',
        description:
          'EOLO supera los $15M de ingresos y demuestra su capacidad de crecimiento.',
      },
      {
        title: '2024 - M&A estratégico',
        description:
          'YWow y Wicked amplían la plataforma en juegos, mascotas y categorías outdoor.',
      },
    ],
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
    stats: [
      {
        icon: { src: '/icons/toy-industry-experience.webp' },
        value: '~50 años',
        label: 'Trayectoria en juguetes',
      },
      {
        icon: { src: '/icons/revenue.webp' },
        value: '$19,75M',
        label: 'Ingresos 2025',
      },
      {
        icon: { src: '/icons/countries.webp' },
        value: '59',
        label: 'Países',
      },
      { icon: { src: '/icons/clients.webp' }, value: '180', label: 'Clientes' },
      {
        icon: { src: '/icons/direct-retailers.webp' },
        value: '125',
        label: 'Minoristas Directos',
      },
      {
        icon: { src: '/icons/distributors.webp' },
        value: '55',
        label: 'Distribuidores',
      },
      {
        icon: { src: '/icons/storefronts.webp' },
        value: '33.000',
        label: 'Puntos de venta',
      },
      {
        icon: { src: '/icons/revenue-employee.webp' },
        value: '$681K',
        label: 'Ingresos / Empleado',
      },
    ],
    platform: {
      heading: 'Plataforma Operativa Global',
      locations: [
        {
          icon: { src: '/icons/spain.webp' },
          name: 'España',
          description:
            'Corporativo, Desarrollo de Producto, Finanzas y Creatividad.',
        },
        {
          icon: { src: '/icons/china.webp' },
          name: 'Hong Kong / China',
          description: 'Sourcing, Manufactura, Gestión de Proveedores y QA.',
        },
        {
          icon: { src: '/icons/usa.webp' },
          name: 'Estados Unidos',
          description: 'Escala Comercial, Retail y Expansión.',
        },
      ],
    },
  },

  board: {
    accent: 'Directiva',
    title: 'Junta',
    subtitle:
      'Gobierno corporativo para la nueva etapa: mercado, M&A, inversores y escala internacional.',
    members: [
      {
        name: 'Alex Prieto',
        role: 'Presidente',
        description:
          'Co-Fundador con 26 años de experiencia en la industria del juguete. Tres veces honrado en el Mojo Nation 100.',
        image: { src: '/board/alex-prieto.webp', alt: 'Alex Prieto' },
      },
      {
        name: 'Jose M. Diaz',
        role: 'Vicepresidente',
        description:
          'Co-Fundador con 20 años de experiencia en la gestión de ventas internacionales de juguetes.',
        image: { src: '/board/jose-diaz.webp', alt: 'Jose M. Diaz' },
      },
      {
        name: 'Isabel Prieto',
        role: 'Directora Dominical',
        description:
          'Co-Fundadora con 20 años de experiencia en administración y gestión de recursos humanos.',
        image: { src: '/board/isabel-prieto.webp', alt: 'Isabel Prieto' },
      },
      {
        name: 'Rafael Prieto',
        role: 'Director Ejecutivo',
        description:
          'Co-Fundador con 30 años de experiencia en gestión de producción y diseño internacional de juguetes.',
        image: { src: '/board/rafael-prieto.webp', alt: 'Rafael Prieto' },
      },
      {
        name: 'Jose A. Tuñón',
        role: 'Director Ejecutivo',
        description:
          'CFO con más de 25 años de experiencia en reestructuración y refinanciamiento corporativo.',
        image: { src: '/board/jose-tunon.webp', alt: 'Jose A. Tuñón' },
      },
    ],
    pending: [
      { name: 'TBC', role: 'Secretario', image: { src: '/board/tbc.webp' } },
      {
        name: 'TBC',
        role: 'Representante Financiero',
        image: { src: '/board/tbc.webp' },
      },
      {
        name: 'TBC',
        role: 'Representante de la Industria',
        image: { src: '/board/tbc.webp' },
      },
    ],
  },

  documents: {
    accent: 'Documentos',
    columns: [
      {
        title: 'Información Financiera',
        per_year: [{ year: '2026', documents: [] }],
      },
      {
        title: 'Juntas y Convocatorias',
        per_year: [{ year: '2026', documents: [] }],
      },
      {
        title: 'Documentos para Inversores',
        per_year: [
          {
            year: '2026',
            documents: [
              {
                title: 'Documento de Admisión al Mercado BME Scaleup',
                date: '01/07/2026',
                format: 'PDF',
                size: '8.4 MB',
                href: '/docs/bme-scaleup-market-admission.pdf',
              },
            ],
          },
        ],
      },
    ],
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
