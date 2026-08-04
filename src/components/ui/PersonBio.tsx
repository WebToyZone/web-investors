'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import DecorativeLine from './DecorativeLine';

/** Thin cross in the dialog's top-right corner. */
function CloseIcon() {
  return (
    <svg
      viewBox='0 0 24 24'
      className='h-6 w-6'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      aria-hidden='true'
    >
      <path d='m6 6 12 12M18 6 6 18' />
    </svg>
  );
}

/** Arrow matching the one in the section's other links. */
function ArrowIcon() {
  return (
    <svg
      viewBox='0 0 24 24'
      className='h-5 w-5 shrink-0 text-brand'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <path d='M4 12h15' />
      <path d='m13 6 6 6-6 6' />
    </svg>
  );
}

/**
 * The "View Bio" button and the dialog it opens.
 *
 * Split out of `PersonCard` so the card stays a Server Component: only this
 * button needs to run on the client.
 *
 * Built on the native `<dialog>` element, which gives focus trapping, Escape
 * to close and an inert background for free — all of which a hand-rolled
 * overlay would have to reimplement, usually incompletely.
 */
export default function PersonBio({
  name,
  role,
  description,
}: {
  name: string;
  role: string;
  description: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const t = useTranslations('home');

  return (
    <>
      <button
        type='button'
        onClick={() => dialogRef.current?.showModal()}
        className='mt-3 inline-flex items-center gap-3 rounded-xl border border-neutral-200 px-4 py-2 text-sm font-bold text-neutral-900 transition-colors hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'
      >
        {t('board.viewBio')}
        <ArrowIcon />
      </button>

      <dialog
        ref={dialogRef}
        // A click landing on the dialog itself came from the backdrop: the
        // content sits in the inner wrapper below.
        onClick={(event) => {
          if (event.target === dialogRef.current) {
            dialogRef.current?.close();
          }
        }}
        className='m-auto w-[min(28rem,calc(100vw-2rem))] rounded-3xl p-0 shadow-xl backdrop:bg-neutral-900/50'
      >
        <div className='relative px-10 py-12 text-center'>
          <button
            type='button'
            onClick={() => dialogRef.current?.close()}
            aria-label={t('board.closeBio')}
            className='absolute right-5 top-5 rounded-full p-1 text-neutral-800 transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'
          >
            <CloseIcon />
          </button>

          <h3 className='text-4xl font-bold text-brand'>{name}</h3>
          <p className='mt-2 text-lg font-bold text-neutral-800'>{role}</p>

          {/* Same accent rule the rest of the site uses under a heading. */}
          <span className='flex justify-center'>
            <DecorativeLine marginTop={4} />
          </span>

          <p className='mt-6 text-lg leading-relaxed text-balance text-neutral-600'>
            {description}
          </p>
        </div>
      </dialog>
    </>
  );
}
