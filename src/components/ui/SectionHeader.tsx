import DecorativeLine from './DecorativeLine';

/**
 * Reusable section header used across the investors page.
 *
 * Renders the signature two-tone heading (one part in brand red, the rest in
 * ink), a short red underline and an optional centred subtitle. The accent can
 * sit before or after the rest of the title to match each section.
 */
export interface SectionHeaderProps {
  /** Word(s) shown in brand red, e.g. "Unique" or "Directors". */
  accent: string;
  /** Word(s) shown in ink, e.g. "Business Model" or "Board of". Omit for a single-colour heading. */
  title?: string;
  /** Where the accent sits relative to the title. Defaults to "start". */
  accentPosition?: 'start' | 'end';
  /** Optional supporting line below the heading. */
  subtitle?: string;
  /** Id applied to the heading, for `aria-labelledby` on the parent section. */
  titleId?: string;
}

export default function SectionHeader({
  accent,
  title,
  accentPosition = 'start',
  subtitle,
  titleId,
}: SectionHeaderProps) {
  const accentSpan = <span className='text-brand'>{accent}</span>;

  return (
    <div className='flex flex-col items-center text-center'>
      <h2
        id={titleId}
        className='font-heading text-4xl uppercase leading-none tracking-wide text-neutral sm:text-5xl lg:text-6xl'
      >
        {!title ? (
          accentSpan
        ) : accentPosition === 'start' ? (
          <>
            {accentSpan} {title}
          </>
        ) : (
          <>
            {title} {accentSpan}
          </>
        )}
      </h2>

      <DecorativeLine marginTop={4} />

      {subtitle && (
        <p className='mt-6 max-w-2xl text-xl text-balance leading-relaxed text-neutral-600'>
          {subtitle}
        </p>
      )}
    </div>
  );
}
