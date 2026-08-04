import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ImageBand from '@/components/ui/ImageBand';
import HeroSection from '@/components/sections/HeroSection';
import GrowthJourneySection from '@/components/sections/GrowthJourneySection';
import BusinessModelSection from '@/components/sections/BusinessModelSection';
import EoloAtAGlanceSection from '@/components/sections/EoloAtAGlanceSection';
import BoardOfDirectorsSection from '@/components/sections/BoardOfDirectorsSection';
import PowerOfASmileSection from '@/components/sections/PowerOfASmileSection';
import DocumentsSection from '@/components/sections/DocumentsSection';
import ContactSection from '@/components/sections/ContactSection';
import { getInvestorsPage, type Locale } from '@data/investorsData';
import { getPublicDocuments } from '@/services/documents/public-documents';
import { getPublicGlance } from '@/services/glance/public-glance';
import { getPublicGrowth } from '@/services/growth/public-growth';
import { getPublicContact } from '@/services/contact/public-contact';
import { getPublicVideos } from '@/services/videos/public-videos';
import { getLocale, getTranslations } from 'next-intl/server';

export default async function InvestorsPage() {
  const locale = await getLocale() as Locale;
  const t = await getTranslations('navbar');
  const links = [
    { label: t('growthJourney'), href: '#growth-journey' },
    { label: t('businessModel'), href: '#business-model' },
    { label: t('eoloAtAGlance'), href: '#eolo-at-a-glance' },
    { label: t('boardOfDirectors'), href: '#board-of-directors' },
    { label: t('documents'), href: '#documents' },
    { label: t('contacts'), href: '#contacts' },
  ];

  const content = await getInvestorsPage(locale as Locale);
  // The section heading is i18n copy and stays in the static content; the
  // columns themselves are whatever the admin has published.
  const documentColumns = await getPublicDocuments(locale);
  const glance = await getPublicGlance(locale);
  const growth = await getPublicGrowth(locale);
  const contactInfo = await getPublicContact(locale);
  const videos = await getPublicVideos();

  return (
    <>
      <Navbar logo={content.navbar.logo} links={links} />

      <main id='top'>
        {/* The clip comes from the admin; the poster and the accessible
            description stay in the static content. */}
        <HeroSection video={{ ...content.hero, ...videos.hero }} />
        <GrowthJourneySection
          content={{
            ...content.growthJourney,
            chart: { ...content.growthJourney.chart, data: growth.revenue },
            milestones: growth.milestones,
          }}
          decoration={content.growthDecoration}
        />
        <BusinessModelSection content={content.businessModel} />
        <ImageBand
          src={content.cockpitBand.src}
          alt={content.cockpitBand.alt}
        />
        <EoloAtAGlanceSection
          content={{
            ...content.glance,
            stats: glance.stats,
            platform: {
              ...content.glance.platform,
              locations: glance.locations,
            },
          }}
        />
        <BoardOfDirectorsSection content={content.board} />
        <PowerOfASmileSection
          content={{
            ...content.powerOfASmile,
            video: { ...content.powerOfASmile.video, ...videos.powerOfASmile },
          }}
        />
        <DocumentsSection
          content={{
            accent: content.documents.accent,
            columns: documentColumns,
          }}
        />
        <ContactSection
          content={{
            ...content.contact,
            info: contactInfo ?? content.contact.info,
          }}
          locale={locale}
          decoration={content.contactDecoration}
        />
      </main>

      <Footer content={content.footer} />
    </>
  );
}
