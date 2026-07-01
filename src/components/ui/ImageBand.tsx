import Image from "next/image";

/**
 * Full-bleed image band used as a visual separator between content sections
 * (e.g. the red cockpit image). Purely presentational.
 */
export interface ImageBandProps {
  src: string;
  /** Empty string marks the image as decorative (hidden from assistive tech). */
  alt: string;
  priority?: boolean;
  /**
   * Tailwind height utilities. Defaults to a responsive cinematic band; pass a
   * custom value to override.
   */
  heightClassName?: string;
}

export default function ImageBand({
  src,
  alt,
  priority = false,
  heightClassName = "h-[24vh] min-h-[140px] sm:h-[28vh] lg:h-[20vh]",
}: ImageBandProps) {
  const decorative = alt.trim() === "";
  return (
    <div className={`relative w-full overflow-hidden bg-bgNeutral ${heightClassName}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="100vw"
        aria-hidden={decorative ? true : undefined}
        className="object-cover object-top"
      />
    </div>
  );
}
