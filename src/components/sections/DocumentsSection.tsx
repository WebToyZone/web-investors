import SectionHeader from '@/components/ui/SectionHeader';
import Link from 'next/link';

/**
 * Data shapes for the Documents section.
 *
 * Fed statically from `data/investors.ts` for now; plain serialisable fields
 * keep it ready to come from a Prisma-backed CMS later. Each column groups its
 * files under a year, so a year filter/selector can be layered on without
 * reshaping the data.
 */
export interface DocumentItem {
  /** File title, e.g. "BME Scaleup Market Admission Document". */
  title: string;
  /** Publication date as shown, e.g. "01/07/2026". */
  date: string;
  /** File format badge, e.g. "PDF". */
  format: string;
  /** Human-readable file size, e.g. "8.4 MB". */
  size: string;
  /** Download URL. */
  href: string;
}

export interface DocumentColumn {
  /** Column title, e.g. "Financial Information". */
  title: string;
  /** Documents grouped by year. */
  per_year: { year: string; documents: DocumentItem[] }[];
}

export interface DocumentsContent {
  accent: string;
  columns: DocumentColumn[];
}

export interface DocumentsSectionProps {
  content: DocumentsContent;
}

/** Simple PDF/format badge rendered from text (no icon asset required). */
function FormatBadge({ format }: { format: string }) {
  return (
    <span
      aria-hidden='true'
      className='flex h-9 w-8 shrink-0 items-center justify-center rounded border border-brand text-[9px] font-bold uppercase tracking-tight text-brand'
    >
      {format}
    </span>
  );
}

/** Minimal download (arrow-into-tray) glyph. */
function DownloadIcon() {
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
      <path d='M12 3v12' />
      <path d='m7 11 5 5 5-5' />
      <path d='M5 21h14' />
    </svg>
  );
}

function DocumentRow({ document }: { document: DocumentItem }) {
  return (
    <li className='border-b border-neutral-200'>
      <Link
        href={document.href}
        download
        className='group flex items-center gap-4 py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'
      >
        <FormatBadge format={document.format} />
        <span className='min-w-0 flex-1'>
          <span className='block font-bold text-neutral group-hover:text-brand'>
            {document.title}
          </span>
          <span className='mt-0.5 block text-sm text-neutral-500'>
            {document.date} &nbsp;-&nbsp; {document.format} - {document.size}
          </span>
        </span>
        <DownloadIcon />
      </Link>
    </li>
  );
}

/**
 * Documents section: three columns of downloadable files grouped by year.
 * Static / presentational — safe as a Server Component.
 */
export default function DocumentsSection({ content }: DocumentsSectionProps) {
  const { accent, columns } = content;

  return (
    <section
      id='documents'
      aria-labelledby='documents-title'
      className='scroll-mt-24 bg-white'
    >
      <div className='container-site py-20 lg:py-24'>
        <SectionHeader accent={accent} titleId='documents-title' />

        <div className='mt-12 lg:mt-16 grid grid-cols-1 gap-10 lg:grid-cols-3 px-8 lg:px-0'>
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className='text-center text-2xl lg:text-3xl font-bold text-neutral'>
                {column.title}
              </h3>

              {column.per_year.map((yearGroup) => (
                <div key={yearGroup.year} className='mt-5'>
                  <p className='rounded bg-neutral-100 py-3 text-center text-xl lg:text-2xl text-neutral-800'>
                    {yearGroup.year}
                  </p>

                  {yearGroup.documents.length > 0 ? (
                    <ul className='mt-2'>
                      {yearGroup.documents.map((document) => (
                        <DocumentRow key={document.href} document={document} />
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
