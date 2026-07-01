import { FaEye, FaPlus } from 'react-icons/fa6';
import type { AdminSection, AdminSectionId } from './types';
import { PrimaryButton, SecondaryButton } from './ui';

export default function AdminShell({
  activeSection,
  sections,
  children,
  onSectionChange,
}: {
  activeSection: AdminSectionId;
  sections: AdminSection[];
  children: React.ReactNode;
  onSectionChange: (section: AdminSectionId) => void;
}) {
  const currentSection =
    sections.find((section) => section.id === activeSection) ?? sections[0];

  return (
    <main className='min-h-screen bg-neutral-100 text-neutral-900'>
      <div className='grid min-h-screen xl:grid-cols-[280px_1fr]'>
        <aside className='border-b border-neutral-200 bg-white xl:border-b-0 xl:border-r'>
          <div className='flex h-full flex-col px-5 py-6'>
            <div>
              <p className='font-heading text-4xl leading-none text-brand'>
                EOLO
              </p>
              <p className='mt-1 text-sm font-bold uppercase text-neutral-500'>
                Investors admin
              </p>
            </div>

            <nav aria-label='Administracion' className='mt-8'>
              <ul className='space-y-1'>
                {sections.map((section) => {
                  const Icon = section.icon;
                  const active = section.id === activeSection;

                  return (
                    <li key={section.id}>
                      <button
                        type='button'
                        onClick={() => onSectionChange(section.id)}
                        className={[
                          'flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-bold transition-colors',
                          active
                            ? 'bg-brand text-white'
                            : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950',
                        ].join(' ')}
                      >
                        <Icon className='h-4 w-4 shrink-0' />
                        <span className='min-w-0 truncate'>
                          {section.label}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className='mt-auto rounded-md border border-neutral-200 bg-neutral-50 p-4'>
              <p className='text-sm font-bold text-neutral-900'>
                Preparado para Prisma
              </p>
              <p className='mt-1 text-sm leading-relaxed text-neutral-600'>
                Todas las vistas usan formas de datos que luego pueden venir de
                Neon.
              </p>
            </div>
          </div>
        </aside>

        <section className='min-w-0'>
          <header className='border-b border-neutral-200 bg-white'>
            <div className='flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8'>
              <div>
                <p className='text-sm font-bold uppercase text-brand'>
                  {currentSection.eyebrow}
                </p>
                <h1 className='mt-1 text-3xl font-black text-neutral-950'>
                  {currentSection.label}
                </h1>
                <p className='mt-1 max-w-2xl text-sm text-neutral-600'>
                  {currentSection.description}
                </p>
              </div>

              <div className='flex flex-wrap items-center gap-2'>
                <SecondaryButton icon={FaEye}>Vista previa</SecondaryButton>
                <PrimaryButton icon={FaPlus}>Nuevo contenido</PrimaryButton>
              </div>
            </div>
          </header>

          <div className='px-5 py-6 lg:px-8'>{children}</div>
        </section>
      </div>
    </main>
  );
}
