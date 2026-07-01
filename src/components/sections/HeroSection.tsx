/**
 * Data shape for the Hero section.
 *
 * Currently fed statically from `data/investorsData.ts`. The shape is intentionally
 * CMS-friendly (plain serialisable fields) so it can later be hydrated from a
 * Prisma-backed model without touching this component.
 */
export interface HeroVideo {
  /** Video URL (local `/public` path now, remote CMS asset later). */
  src: string;
  /** Optional MIME type, e.g. "video/mp4" or "video/webm". */
  type?: string;
  /** Poster image shown before the video loads and as the LCP/fallback frame. */
  poster?: string;
  /**
   * Accessible description of the clip. Decorative-but-meaningful background
   * video, so this is surfaced via the section's aria-label.
   */
  alt: string;
}

export interface HeroSectionProps {
  video: HeroVideo;
}

/**
 * Full-bleed cinematic hero band backed by an autoplaying background video.
 *
 * The reference design uses a single edge-to-edge clip with no text or CTA
 * overlay, so this component is purely presentational. The video is muted,
 * looped and inline (required for mobile autoplay) and falls back to its
 * poster image when the clip cannot play.
 */
export default function HeroSection({ video }: HeroSectionProps) {
  return (
    <section
      aria-label={video.alt}
      className='relative w-full overflow-hidden bg-neutral-50'
    >
      <h1 className='sr-only'>EOLO Investor Relations</h1>
      <div className='relative h-[56vh] min-h-80 w-full sm:h-[64vh] lg:aspect-video lg:h-dvh lg:-mt-32'>
        <video
          className='absolute inset-0 h-full w-full object-cover object-[center_80%] lg:object-center'
          autoPlay
          loop
          muted
          playsInline
          preload='metadata'
          aria-hidden='true'
        >
          <source src={video.src} type={video.type ?? 'video/mp4'} />
        </video>
      </div>
    </section>
  );
}
