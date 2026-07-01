import type { ComponentType, ReactNode } from 'react';
import {
  FaCheck,
  FaClock,
  FaPen,
  FaRegFileLines,
  FaTrashCan,
} from 'react-icons/fa6';
import type { PublishStatus } from './types';

const statusConfig = {
  published: {
    label: 'Publicado',
    icon: FaCheck,
    className: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  },
  draft: {
    label: 'Borrador',
    icon: FaRegFileLines,
    className: 'bg-neutral-100 text-neutral-700 ring-neutral-200',
  },
  scheduled: {
    label: 'Programado',
    icon: FaClock,
    className: 'bg-amber-50 text-amber-700 ring-amber-200',
  },
} satisfies Record<
  PublishStatus,
  {
    label: string;
    icon: ComponentType<{ className?: string }>;
    className: string;
  }
>;

export function StatusBadge({ status }: { status: PublishStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${config.className}`}
    >
      <Icon className='h-3 w-3' />
      {config.label}
    </span>
  );
}

export function IconButton({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      type='button'
      aria-label={label}
      title={label}
      className='inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-700 transition-colors hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'
    >
      {children}
    </button>
  );
}

export function PrimaryButton({
  children,
  icon: Icon,
}: {
  children: ReactNode;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <button
      type='button'
      className='inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'
    >
      <Icon className='h-4 w-4' />
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  icon: Icon,
}: {
  children: ReactNode;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <button
      type='button'
      className='inline-flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-bold text-neutral-800 transition-colors hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'
    >
      <Icon className='h-4 w-4' />
      {children}
    </button>
  );
}

export function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className='rounded-md border border-neutral-200 bg-white p-4'>
      <p className='text-sm font-bold text-neutral-500'>{label}</p>
      <p className='mt-2 text-3xl font-black text-neutral-950'>{value}</p>
    </div>
  );
}

export function Panel({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
}) {
  return (
    <section className='rounded-md border border-neutral-200 bg-white'>
      <div className='border-b border-neutral-200 px-5 py-4'>
        {eyebrow ? (
          <p className='text-xs font-bold uppercase text-brand'>{eyebrow}</p>
        ) : null}
        <h2 className='text-lg font-black text-neutral-950'>{title}</h2>
      </div>
      <div className='p-5'>{children}</div>
    </section>
  );
}

export function TextField({
  label,
  value,
  multiline = false,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <label className='block'>
      <span className='text-xs font-bold uppercase text-neutral-500'>
        {label}
      </span>
      {multiline ? (
        <textarea
          value={value}
          readOnly
          rows={4}
          className='mt-1 w-full resize-none rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-2 focus:outline-offset-2 focus:outline-brand'
        />
      ) : (
        <input
          value={value}
          readOnly
          className='mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-2 focus:outline-offset-2 focus:outline-brand'
        />
      )}
    </label>
  );
}

export function ActionRow() {
  return (
    <div className='flex justify-end gap-2'>
      <IconButton label='Editar'>
        <FaPen className='h-4 w-4' />
      </IconButton>
      <IconButton label='Eliminar'>
        <FaTrashCan className='h-4 w-4' />
      </IconButton>
    </div>
  );
}
