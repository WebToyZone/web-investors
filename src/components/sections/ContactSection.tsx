'use client';

import { useState, type FormEvent } from 'react';
import DecorativeLine from '../ui/DecorativeLine';
import Link from 'next/link';
import Image from 'next/image';
import { submitContact } from '@/actions/contact/submit-contact';
import { Locale } from '@/types/locale';

export interface ContactInfo {
  email: string;
  phone: string;
  addressLines: string[];
}

export interface ContactLabels {
  heading: string;
  subtitle: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  consent: string;
  submit: string;
}

export interface ContactFormValues {
  name: string;
  phone: string;
  email: string;
  message: string;
  consent: boolean;
}

export interface ContactContent {
  accent: string;
  labels: ContactLabels;
  info: ContactInfo;
}

export interface ContactSectionProps {
  content: ContactContent;
  locale: Locale;
  decoration?: { src: string; alt?: string };
}

const EMPTY: ContactFormValues = {
  name: '',
  phone: '',
  email: '',
  message: '',
  consent: false,
};

const fieldClasses =
  'w-full rounded-lg bg-white px-4 py-3 text-neutral-900 placeholder:text-neutral-500 focus:outline-2 focus:outline-offset-2 focus:outline-brand';

function MailIcon() {
  return (
    <svg
      viewBox='0 0 24 24'
      className='h-5 w-5 text-[#C8002D]'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <rect x='3' y='5' width='18' height='14' rx='2' />
      <path d='m3 7 9 6 9-6' />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      viewBox='0 0 24 24'
      className='h-5 w-5 text-[#C8002D]'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <path d='M5 4h4l2 5-3 2a14 14 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 6a2 2 0 0 1 2-2' />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      viewBox='0 0 24 24'
      className='h-5 w-5 text-[#C8002D]'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <path d='M12 21s7-6.5 7-11a7 7 0 1 0-14 0c0 4.5 7 11 7 11Z' />
      <circle cx='12' cy='10' r='2.5' />
    </svg>
  );
}

export default function ContactSection({
  content,
  locale,
  decoration,
}: ContactSectionProps) {
  const { labels, info } = content;

  const [values, setValues] = useState<ContactFormValues>(EMPTY);
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  function update<K extends keyof ContactFormValues>(
    key: K,
    value: ContactFormValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function resetForm() {
    setValues(EMPTY);
    setError('');
    setIsSuccess(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSuccess(false);
    setError('');

    if (!values.consent) {
      setError(
        locale === 'es'
          ? 'Debes aceptar los términos y condiciones.'
          : 'You must accept the terms and conditions.',
      );
      return;
    }

    setIsPending(true);

    try {
      const result = await submitContact(values, locale);

        console.log('result:', result);

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.success) {
        setValues(EMPTY);
        setIsSuccess(true);
      }
    } finally {
      setIsPending(false);
    }
  }

  return (
    <section
      id='contacts'
      aria-labelledby='contacts-title'
      className='scroll-mt-24 bg-neutral-100'
    >
      <div className='relative container-site py-16 sm:py-20 lg:py-24'>
        {decoration && (
          <div className='pointer-events-none absolute bottom-6 -left-95 hidden w-110 -rotate-6 2xl:block'>
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

        <div className='grid gap-12 px-8 lg:grid-cols-2 lg:gap-16 lg:px-0'>
          <div className='relative'>
            <h2
              id='contacts-title'
              className='text-3xl font-extrabold text-neutral-700 sm:text-5xl'
            >
              {labels.heading}
            </h2>

            <DecorativeLine marginTop={4} />

            <p className='mt-6 max-w-md text-lg leading-relaxed text-neutral-700'>
              {labels.subtitle}
            </p>

            <ul className='mt-3 space-y-3'>
              <li className='flex items-center gap-3'>
                <MailIcon />
                <Link
                  href={`mailto:${info.email}`}
                  className='text-neutral-900 hover:text-brand'
                >
                  {info.email}
                </Link>
              </li>

              <li className='flex items-center gap-3'>
                <PhoneIcon />
                <Link
                  href={`tel:${info.phone.replace(/\s+/g, '')}`}
                  className='text-neutral-900 hover:text-brand'
                >
                  {info.phone}
                </Link>
              </li>

              <li className='flex items-start gap-3'>
                <span className='mt-0.5'>
                  <PinIcon />
                </span>
                <address className='not-italic text-neutral-900'>
                  {info.addressLines.map((line) => (
                    <span key={line} className='block'>
                      {line}
                    </span>
                  ))}
                </address>
              </li>
            </ul>
          </div>

          {isSuccess ? (
            <div className='rounded-3xl border border-neutral-200 bg-white p-8 text-center shadow-sm sm:p-10'>
              <div className='mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-2xl font-bold text-white'>
                ✓
              </div>

              <h3 className='text-2xl font-extrabold text-neutral-800'>
                {locale === 'es' ? '¡Gracias!' : 'Thank you!'}
              </h3>

              <p className='mt-4 text-neutral-700'>
                {locale === 'es'
                  ? 'Tu mensaje se ha enviado correctamente.'
                  : 'Your message has been sent successfully.'}
              </p>

              <p className='mt-2 text-neutral-700'>
                {locale === 'es'
                  ? 'Nuestro equipo de Relación con Inversores revisará tu consulta y se pondrá en contacto contigo lo antes posible.'
                  : 'Our Investor Relations team will review your enquiry and get back to you as soon as possible.'}
              </p>

              <button
                type='button'
                onClick={resetForm}
                className='mt-6 rounded-full bg-brand px-8 py-3 font-bold text-white transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'
              >
                {locale === 'es' ? 'Enviar otro mensaje' : 'Send another message'}
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className='flex flex-col gap-4'
            >
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <input
                  id='contact-name'
                  name='name'
                  type='text'
                  required
                  placeholder={labels.name}
                  value={values.name}
                  onChange={(event) => update('name', event.target.value)}
                  className={fieldClasses}
                />

                <input
                  id='contact-phone'
                  name='phone'
                  type='tel'
                  required
                  placeholder={labels.phone}
                  value={values.phone}
                  onChange={(event) => update('phone', event.target.value)}
                  className={fieldClasses}
                />
              </div>

              <input
                id='contact-email'
                name='email'
                type='email'
                required
                placeholder={labels.email}
                value={values.email}
                onChange={(event) => update('email', event.target.value)}
                className={fieldClasses}
              />

              <textarea
                id='contact-message'
                name='message'
                required
                rows={6}
                placeholder={labels.message}
                value={values.message}
                onChange={(event) => update('message', event.target.value)}
                className={`${fieldClasses} resize-y`}
              />

              <div className='my-3 flex items-center gap-3'>
                <input
                  id='contact-consent'
                  name='consent'
                  type='checkbox'
                  required
                  checked={values.consent}
                  onChange={(event) => update('consent', event.target.checked)}
                  className='h-5 w-5 shrink-0 accent-brand'
                />

                <label
                  htmlFor='contact-consent'
                  className='text-sm text-neutral-700'
                >
                  {labels.consent}*
                </label>
              </div>

              <div>
                <button
                  type='submit'
                  disabled={!values.consent || isPending}
                  className='rounded-full bg-brand px-8 py-3 font-bold text-white transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50'
                >
                  {isPending
                    ? locale === 'es'
                      ? 'Enviando...'
                      : 'Sending...'
                    : labels.submit}
                </button>

                {error && (
                  <p className='mt-3 text-sm font-medium text-red-700'>
                    {error}
                  </p>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}