import Image from 'next/image';
import SectionHeader from '@/components/ui/SectionHeader';
import DecorativeLine from '../ui/DecorativeLine';

/**
 * Data shapes for the "Eolo at a Glance" section.
 *
 * Fed statically from `data/investors.ts` for now; plain serialisable fields
 * keep it ready to come from a Prisma-backed CMS later.
 */
export interface GlanceStat {
  /** 3D icon asset. */
  icon: { src: string; alt?: string };
  /** Highlighted figure, e.g. "$19,75M" or "~50 years". */
  value: string;
  /** Supporting label, e.g. "2025 Revenue". */
  label: string;
}

export interface OperatingLocation {
  /** Line icon asset shown inside a circle. */
  icon: { src: string; alt?: string };
  /** Location name, e.g. "España". */
  name: string;
  /** Role description for the location. */
  description: string;
}

export interface GlanceContent {
  accent: string;
  title: string;
  subtitle: string;
  stats: GlanceStat[];
  platform: {
    heading: string;
    locations: OperatingLocation[];
  };
}

export interface EoloAtAGlanceSectionProps {
  content: GlanceContent;
}

/**
 * "Eolo at a Glance" section: a grid of KPI cards followed by the global
 * operating platform locations. Static / presentational — safe as a Server
 * Component.
 */
export default function EoloAtAGlanceSection({
  content,
}: EoloAtAGlanceSectionProps) {
  const { accent, title, subtitle, stats, platform } = content;

  return (
    <section
      id='eolo-at-a-glance'
      aria-labelledby='eolo-at-a-glance-title'
      className='scroll-mt-24 bg-white'
    >
      <div className='container-site py-16 sm:py-20 lg:py-24'>
        <SectionHeader
          accent={accent}
          title={title}
          subtitle={subtitle}
          titleId='eolo-at-a-glance-title'
        />

        {/* KPI cards */}
        <ul className='mt-14 lg:mt-16 flex flex-wrap justify-center gap-5'>
          {stats.map((stat) => (
            <li
              key={stat.label}
              className='flex min-w-75 max-w-87.5 flex-1 items-center justify-center gap-3 rounded-2xl border border-neutral-200 bg-white py-3 md:py-4 shadow-sm'
            >
              <Image
                src={stat.icon.src}
                alt={stat.icon.alt ?? ''}
                width={124}
                height={124}
                aria-hidden={stat.icon.alt ? undefined : true}
                className='h-26 w-26 md:h-32 md:w-32 shrink-0 object-contain'
              />
              <div className='min-w-0'>
                <p className='text-3xl md:text-4xl font-bold font-condensed leading-tight text-brand'>
                  {stat.value}
                </p>
                <p className='mt-1 text-lg font-condensed text-neutral-800'>
                  {stat.label}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {/* Global operating platform */}
        <div className='mt-14 md:mt-24'>
          <h3 className='text-center text-2xl md:text-3xl font-bold uppercase tracking-wide text-neutral'>
            {platform.heading}
          </h3>
          <ul className='mt-10 lg:mt-16 grid grid-cols-1 gap-10 lg:grid-cols-3'>
            {platform.locations.map((location) => (
              <li key={location.name} className='flex items-start gap-5 px-8 lg:px-0 '>
                <span className='flex h-28 w-28 md:h-32 md:w-32 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-md'>
                  <Image
                    src={location.icon.src}
                    alt={location.icon.alt ?? ''}
                    width={124}
                    height={124}
                    aria-hidden={location.icon.alt ? undefined : true}
                    className='h-28 w-28 md:h-32 md:w-32 object-contain'
                  />
                </span>
                <div className='min-w-0'>
                  <p className='text-2xl font-bold text-brand'>
                    {location.name}
                  </p>

                  <DecorativeLine marginTop={2} />

                  <p className='mt-2 text-lg text-pretty leading-relaxed text-neutral-600'>
                    {location.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
