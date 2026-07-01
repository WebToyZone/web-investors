import SectionHeader from "@/components/ui/SectionHeader";

/**
 * Data shapes for the Business Model section.
 *
 * Fed statically from `data/investorsData.ts` for now; plain serialisable fields
 * keep it ready to come from a Prisma-backed CMS later.
 */
export interface BusinessModelFeature {
  /** Pillar title, e.g. "Asset-Light". */
  title: string;
  /** Supporting description. */
  description: string;
}

export interface BusinessModelContent {
  /** Accent (red) word of the heading, e.g. "Unique". */
  accent: string;
  /** Remaining heading words, e.g. "Business Model". */
  title: string;
  /** Subtitle below the heading. */
  subtitle: string;
  /** Pillars shown as columns (designed for 4, but renders any count). */
  features: BusinessModelFeature[];
}

export interface BusinessModelSectionProps {
  content: BusinessModelContent;
}

/**
 * Business Model section: a two-tone header over a row of equal pillars
 * separated by thin vertical dividers on large screens. Static / presentational
 * — safe as a Server Component.
 */
export default function BusinessModelSection({ content }: BusinessModelSectionProps) {
  const { accent, title, subtitle, features } = content;

  return (
    <section
      id="business-model"
      aria-labelledby="business-model-title"
      className="scroll-mt-24 bg-bgNeutral"
    >
      <div className="container-site pt-16 sm:pt-20 lg:pt-24 pb-16 lg:pb-20">
        <SectionHeader
          accent={accent}
          title={title}
          subtitle={subtitle}
          titleId="business-model-title"
        />

        <ul className="mt-10 lg:mt-16 grid grid-cols-1 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-0">
          {features.map((feature) => (
            <li
              key={feature.title}
              className="flex flex-col items-center px-6 text-center lg:border-l lg:border-neutral-300 lg:first:border-l-0"
            >
              <h3 className="text-3xl lg:text-4xl font-bold text-brand font-condensed">{feature.title}</h3>
              <p className="mt-4 text-lg text-pretty leading-relaxed text-neutral-700">
                {feature.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
