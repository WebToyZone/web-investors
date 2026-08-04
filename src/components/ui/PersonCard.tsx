import Image from 'next/image';
import PersonBio from './PersonBio';

/**
 * Reusable person card for the Board of Directors.
 *
 * Two variants:
 * - "photo": circular portrait (appointed members).
 * - "placeholder": brand icon for seats still to be confirmed (TBC).
 *
 * The biography is not shown on the card: it opens in a dialog behind the
 * "View Bio" button, which only appears for people who have one — the seats
 * still to be confirmed do not.
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
        <PersonBio name={name} role={role} description={description} />
      )}
    </div>
  );
}
