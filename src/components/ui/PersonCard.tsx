import Image from 'next/image';

/**
 * Reusable person card for the Board of Directors.
 *
 * Two variants:
 * - "photo": circular portrait (appointed members).
 * - "placeholder": brand icon for seats still to be confirmed (TBC).
 */
export interface PersonCardProps {
  name: string;
  role: string;
  description?: string;
  image: { src: string; alt?: string };
}

export default function PersonCard({
  name,
  role,
  description,
  image,
}: PersonCardProps) {
  return (
    <div className='flex flex-col items-center text-center'>
      <Image
        src={image.src}
        alt={image.alt ?? ''}
        width={80}
        height={80}
        sizes="192px"
        aria-hidden={image.alt ? undefined : true}
        className='h-48 w-48 object-contain'
      />

      <h3 className='mt-4 text-3xl font-bold text-brand'>{name}</h3>
      <p className=' text-xl font-condensed text-neutral'>{role}</p>
      {description && (
        <p className='mt-2 max-w-xs text-lg text-pretty leading-relaxed text-neutral-600'>
          {description}
        </p>
      )}
    </div>
  );
}
