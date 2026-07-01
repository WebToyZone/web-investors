import Image from 'next/image';

/**
 * Data shapes for the Growth Journey section.
 *
 * Fed statically from `data/investors.ts` for now; plain serialisable fields
 * keep it ready to come from a Prisma-backed CMS later.
 */
export interface RevenueDatum {
  /** X-axis label, e.g. "2020". */
  year: string;
  /** Numeric value used to size the bar. */
  value: number;
  /** Display label rendered above the bar, e.g. "$6.67". */
  label: string;
}

export interface Milestone {
  /** Year / headline prefix, e.g. "2020 - CuiCui Studios". */
  title: string;
  /** Supporting description. */
  description: string;
}

export interface GrowthJourneyContent {
  /** Section heading, e.g. "Growth Journey 2020—2025". */
  title: string;
  /** Period covered by the growth journey, e.g. "2020—2025". */
  period: string;
  /** Bold introductory line. */

  lead: string;
  /** Regular supporting paragraph. */
  body: string;
  chart: {
    caption: string;
    data: RevenueDatum[];
  };
  milestones: Milestone[];
}

export interface GrowthJourneySectionProps {
  content: GrowthJourneyContent;
  /** Optional decorative artwork (the kite), shown bottom-right on large screens. */
  decoration?: { src: string; alt?: string };
}

/* ---- SVG bar-chart geometry (no chart library) ---- */
const CHART_WIDTH = 620;
const CHART_HEIGHT = 380;
const PADDING_TOP = 56; // room for value labels
const PADDING_BOTTOM = 48; // room for year labels
const BAR_GAP = 24;
const BAR_RADIUS = 8;

/** Builds an SVG path for a bar with only its top corners rounded. */
function roundedTopBar(
  x: number,
  y: number,
  width: number,
  height: number,
): string {
  const r = Math.min(BAR_RADIUS, width / 2, height);
  const baseline = y + height;
  return [
    `M${x},${baseline}`,
    `V${y + r}`,
    `Q${x},${y} ${x + r},${y}`,
    `H${x + width - r}`,
    `Q${x + width},${y} ${x + width},${y + r}`,
    `V${baseline}`,
    'Z',
  ].join(' ');
}

/**
 * Growth Journey section: intro copy, a hand-rolled SVG revenue bar chart and
 * a vertical milestone timeline. Static / presentational — safe as a Server
 * Component.
 */
export default function GrowthJourneySection({
  content,
  decoration,
}: GrowthJourneySectionProps) {
  const { title, period, lead, body, chart, milestones } = content;

  const plotHeight = CHART_HEIGHT - PADDING_TOP - PADDING_BOTTOM;
  const maxValue = Math.max(...chart.data.map((d) => d.value), 0) || 1;
  const barWidth =
    (CHART_WIDTH - BAR_GAP * (chart.data.length + 1)) / chart.data.length;

  const bars = chart.data.map((datum, index) => {
    const barHeight = (datum.value / maxValue) * plotHeight;
    const x = BAR_GAP + index * (barWidth + BAR_GAP);
    const y = PADDING_TOP + (plotHeight - barHeight);
    const centerX = x + barWidth / 2;
    return { ...datum, x, y, barHeight, centerX };
  });

  return (
    <section
      id='growth-journey'
      aria-labelledby='growth-journey-title'
      className='relative scroll-mt-24 overflow-hidden bg-white'
    >
      <div className='grid container-site gap-12 py-16 sm:py-20 lg:grid-cols-3 lg:gap-16 lg:py-24'>
        {/* Column 1 — copy */}
        <div className='flex flex-col items-start justify-center'>
          <h2
            id='growth-journey-title'
            className='font-heading text-4xl uppercase leading-none tracking-wide text-brand sm:text-5xl'
          >
            {title}
          </h2>
          <h3 className='font-condensed font-bold text-3xl uppercase leading-none tracking-wide text-brand sm:text-4xl'>
            {period}
          </h3>
          <span
            className='mt-4 block h-1 w-12 rounded-full bg-brand'
            aria-hidden='true'
          />
          <p className='mt-6 text-xl text-pretty font-bold text-neutral-900'>
            {lead}
          </p>
          <p className='mt-4 text-lg text-pretty leading-relaxed text-neutral'>
            {body}
          </p>
        </div>

        {/* Column 2 — revenue chart */}
        <figure className='flex flex-col items-center justify-center'>
          <svg
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            className='h-auto w-full max-w-xl'
            role='img'
            aria-label={`Consolidated revenue by year. ${chart.data
              .map((d) => `${d.year}: ${d.label}`)
              .join(', ')}.`}
          >
            {bars.map((bar) => (
              <g key={bar.year}>
                <path
                  d={roundedTopBar(bar.x, bar.y, barWidth, bar.barHeight)}
                  fill='var(--color-brand)'
                />
                <text
                  x={bar.centerX}
                  y={bar.y - 14}
                  textAnchor='middle'
                  className='fill-neutral-900 text-2xl font-medium'
                >
                  {bar.label}
                </text>
                <text
                  x={bar.centerX}
                  y={CHART_HEIGHT - 14}
                  textAnchor='middle'
                  className='fill-neutral-700 text-2xl'
                >
                  {bar.year}
                </text>
              </g>
            ))}
          </svg>

          <figcaption className='mt-2 text-base text-neutral'>
            {chart.caption}
          </figcaption>

          {/* Accessible equivalent of the chart */}
          <table className='sr-only'>
            <caption>{chart.caption}</caption>
            <thead>
              <tr>
                <th scope='col'>Year</th>
                <th scope='col'>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {chart.data.map((d) => (
                <tr key={d.year}>
                  <th scope='row'>{d.year}</th>
                  <td>{d.label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </figure>

        {/* Column 3 — milestones timeline */}
        <div className='relative'>
          <ol className="relative z-10 ml-1 space-y-8 before:absolute before:bottom-2 before:left-1.25 before:top-2 before:w-0.5 before:bg-brand before:content-['']">
            {milestones.map((milestone) => (
              <li key={milestone.title} className='relative pl-8'>
                <span
                  className='absolute left-0 top-1.5 h-3 w-3 rounded-full bg-brand ring-4 ring-white'
                  aria-hidden='true'
                />
                <h3 className='text-xl font-bold text-brand'>
                  {milestone.title}
                </h3>
                <p className='mt-1 text-lg text-balance leading-relaxed text-neutral'>
                  {milestone.description}
                </p>
              </li>
            ))}
          </ol>
          {decoration && (
            <div className='z-0 pointer-events-none absolute -bottom-64 hidden w-200 2xl:block'>
              <Image
                priority
                src={decoration.src}
                alt={decoration.alt ?? ''}
                width={1136}
                height={846}
                className='h-auto w-full'
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
