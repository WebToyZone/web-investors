/**
 * Data shape for the "Power of a Smile" banner.
 *
 * Fed statically from `data/investorsData.ts` for now; plain serialisable fields
 * keep it ready to come from a Prisma-backed CMS later.
 */
export interface PowerOfASmileContent {
  /** Overlaid headline, e.g. "The Power of a Smile". */
  heading: string;
  video: {
    src: string;
    type?: string;
    poster?: string;
    /** Accessible description of the background clip. */
    alt: string;
  };
}

export interface PowerOfASmileSectionProps {
  content: PowerOfASmileContent;
}

/**
 * Full-bleed emotional banner: an autoplaying background video with a large
 * white headline overlaid on the brand-red footage. The video is decorative
 * (muted, looped, inline) and falls back to its poster; the headline is real,
 * accessible text.
 */
export default function PowerOfASmileSection({ content }: PowerOfASmileSectionProps) {
  const { heading, video } = content;

  return (
    <section
      aria-label={heading}
      className="relative w-full overflow-hidden bg-[#C8002D]"
    >
       <div className="relative h-[56vh] min-h-80 w-full sm:h-[64vh] lg:aspect-video lg:h-dvh -mt-28">
        <video
          className="absolute inset-0 h-full w-full object-cover object-[center_80%] lg:object-center"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src={video.src} type={video.type ?? "video/mp4"} />
        </video>
      </div>
      {/* <div className="relative h-[70vh] min-h-90 w-full">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={video.poster}
          aria-hidden="true"
        >
          <source src={video.src} type={video.type ?? "video/mp4"} />
        </video> */}

        {/* Headline overlay */}
          {/* <div className="relative z-10 flex h-full container-site items-center  lg:px-12">
            <h2 className="max-w-2xl font-heading text-5xl uppercase leading-[0.95] tracking-wide text-white drop-shadow-md sm:text-6xl lg:text-8xl">
              {heading}
            </h2>
          </div>
        </div> */}
    </section>
  );
}
