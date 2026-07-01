import type { HeroVideo } from '@/components/sections/HeroSection';
import type { NavbarLogo, NavLink } from '@/components/layout/Navbar';
import type { GrowthJourneyContent } from '@/components/sections/GrowthJourneySection';
import type { BusinessModelContent } from '@/components/sections/BusinessModelSection';
import type { GlanceContent } from '@/components/sections/EoloAtAGlanceSection';
import type { BoardContent } from '@/components/sections/BoardOfDirectorsSection';
import type { PowerOfASmileContent } from '@/components/sections/PowerOfASmileSection';
import type { DocumentsContent } from '@/components/sections/DocumentsSection';
import type { ContactContent } from '@/components/sections/ContactSection';
import type { FooterContent } from '@/components/layout/Footer';
import { FaLinkedinIn, FaInstagram, FaYoutube } from 'react-icons/fa6';

/**
 * Static content for the Investors page.
 *
 * This is the single source of truth today. The exported shapes match the
 * component prop interfaces, so the same structures can later be returned from
 * a Prisma-backed CMS query (`getInvestorsPage()`) without touching the
 * components or the page.
 *
 * Asset paths point at `/public`; swap for CMS asset URLs when wired up (and
 * add their host to `images.remotePatterns` in `next.config`).
 */

export const navbar: { logo: NavbarLogo; links: NavLink[] } = {
  logo: { src: '/logo-eolo.webp', alt: 'EOLO - keep smiling!', href: '#top' },
  links: [
    { label: 'Growth Journey', href: '#growth-journey' },
    { label: 'Business Model', href: '#business-model' },
    { label: 'Eolo at a Glance', href: '#eolo-at-a-glance' },
    { label: 'Board of Directors', href: '#board-of-directors' },
    { label: 'Documents', href: '#documents' },
    { label: 'Contacts', href: '#contacts' },
  ],
};

export const hero: HeroVideo = {
  src: '/video/hero.mp4',
  type: 'video/mp4',
  poster: '/video/hero-poster.jpg',
  alt: 'A child flying a red kite on a hilltop at sunset.',
};

export const growthJourney: GrowthJourneyContent = {
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
      description: 'Expansion into technology, apps, and digital experiences.',
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
};

export const growthDecoration = { src: '/decorations/kite.webp', alt: '' };

export const businessModel: BusinessModelContent = {
  accent: 'Unique',
  title: 'Business Model',
  subtitle:
    'A scalable operating platform designed to maximize flexibility, speed-to-market and capital efficiency.',
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
};

export const cockpitBand = { src: '/decorations/cockpit.webp', alt: '' };

export const glance: GlanceContent = {
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
    { icon: { src: '/icons/countries.webp' }, value: '59', label: 'Countries' },
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
};

export const board: BoardContent = {
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
};

export const powerOfASmile: PowerOfASmileContent = {
  heading: 'The Power of a Smile',
  video: {
    src: '/video/video.mp4',
    type: 'video/mp4',
    poster: '/video/smile-poster.jpg',
    alt: 'A red gift box opening to reveal a glowing light.',
  },
};

export const documents: DocumentsContent = {
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
};

export const contact: ContactContent = {
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
};

export const contactDecoration = { src: '/decorations/ufo.webp', alt: '' };

export const footer: FooterContent = {
  logo: { src: '/logo-eolo-white.webp', alt: 'EOLO - keep smiling!' },
  groups: [
    {
      title: 'Investor Centre',
      links: [
        { label: 'Key Facts & Figures', href: '#growth-journey' },
        { label: 'Financial Highlights', href: '#eolo-at-a-glance' },
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
};
