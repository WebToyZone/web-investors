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
  return (
    <>
      <Navbar logo={content.navbar.logo} links={links} />

      <main id='top'>
        <HeroSection video={content.hero} />
        <GrowthJourneySection
          content={content.growthJourney}
          decoration={content.growthDecoration}
        />
        <BusinessModelSection content={content.businessModel} />
        <ImageBand
          src={content.cockpitBand.src}
          alt={content.cockpitBand.alt}
        />
        <EoloAtAGlanceSection content={content.glance} />
        <BoardOfDirectorsSection content={content.board} />
        <PowerOfASmileSection content={content.powerOfASmile} />
        <DocumentsSection content={content.documents} />
        <ContactSection
          content={content.contact}
          locale={locale}
          decoration={content.contactDecoration}
        />
      </main>

      <Footer content={content.footer} />
    </>
  );
}
