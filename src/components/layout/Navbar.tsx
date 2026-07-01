'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import LanguageSwitcher from '../ui/LanguageSwitcher';

/**
 * Navigation data shapes.
 *
 * Fed statically from `data/investors.ts` for now; plain serialisable fields
 * keep it ready to come from a Prisma-backed CMS later.
 */
export interface NavLink {
  /** Visible label, e.g. "Growth Journey". */
  label: string;
  /** In-page anchor, e.g. "#growth-journey". */
  href: string;
}

export interface NavbarLogo {
  src: string;
  alt: string;
  /** Optional anchor the logo links to (defaults to "#top"). */
  href?: string;
}

export interface NavbarProps {
  logo: NavbarLogo;
  links: NavLink[];
}

/** Extracts the section id from an anchor href ("#growth" -> "growth"). */
function idFromHref(href: string): string {
  return href.startsWith('#') ? href.slice(1) : href;
}

/** Scrolls the page to the section with the given anchor href. */
const scrollToSection = (href: string) => {
  const id = idFromHref(href);
  const section = document.getElementById(id);

  if (!section) return;

  section.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
};

/**
 * Sticky top navigation.
 *
 * - Desktop: horizontal red links with a red underline marking the section
 *   currently in view.
 * - Mobile: collapses into an accessible hamburger disclosure.
 *
 * The active link is tracked with an IntersectionObserver over the anchored
 * sections, so no scroll libraries are required.
 */
export default function Navbar({ logo, links }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('');

  // Highlight the link whose target section is currently in view.
  useEffect(() => {
    const sections = links
      .map((link) => document.getElementById(idFromHref(link.href)))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [links]);

  // Close the mobile menu on Escape.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  return (
    <header className='sticky top-0 z-50 w-full border-b border-neutral-100 bg-white/95 backdrop-blur'>
      <nav
        aria-label='Primary'
        className='flex h-24 xl:h-32 container-site items-center justify-between'
      >
        {/* Logo */}
        <button
          type='button'
          onClick={() => {
            window.scrollTo({
              top: 0,
              behavior: 'smooth',
            });

            setIsOpen(false);
          }}
          className='relative inline-flex shrink-0 items-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand cursor-pointer'
        >
          <Image
            src={logo.src}
            alt={logo.alt}
            width={256}
            height={144}
            priority
            className='h-22 xl:h-28 w-auto -rotate-4'
          />
        </button>

        {/* Desktop links */}
        <div>
          <ul className='hidden items-center gap-8 xl:flex'>
            {links.map((link) => {
              const isActive = activeId === idFromHref(link.href);
              return (
                <li key={link.href}>
                  <button
                    type='button'
                    onClick={() => scrollToSection(link.href)}
                    aria-current={isActive ? 'true' : undefined}
                    className={[
                      'relative inline-block py-2 font-bold text-brand text-xl transition-colors hover:text-brand-dark cursor-pointer',
                      'after:absolute after:inset-x-0 after:-bottom-0.5 after:mx-auto after:h-0.5 after:w-7 after:rounded-full after:bg-brand after:transition-opacity',
                      isActive ? 'after:opacity-100' : 'after:opacity-0',
                      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
                    ].join(' ')}
                  >
                    {link.label}
                  </button>
                </li>
              );
            })}
            <LanguageSwitcher />
          </ul>
        </div>

        {/* Mobile toggle */}
        <button
          type='button'
          aria-expanded={isOpen}
          aria-controls='mobile-menu'
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setIsOpen((open) => !open)}
          className='inline-flex h-11 w-11 items-center justify-center rounded-md text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand xl:hidden cursor-pointer'
        >
          <span className='relative block h-4 w-6'>
            <span
              className={[
                'absolute left-0 top-0 h-0.5 w-6 bg-current transition-transform',
                isOpen ? 'translate-y-1.5 rotate-45' : '',
              ].join(' ')}
            />
            <span
              className={[
                'absolute left-0 top-1.5 h-0.5 w-6 bg-current transition-opacity',
                isOpen ? 'opacity-0' : 'opacity-100',
              ].join(' ')}
            />
            <span
              className={[
                'absolute left-0 top-3 h-0.5 w-6 bg-current transition-transform',
                isOpen ? '-translate-y-1.5 -rotate-45' : '',
              ].join(' ')}
            />
          </span>
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        id='mobile-menu'
        hidden={!isOpen}
        className='border-t border-neutral-100 xl:hidden absolute top-full left-0 w-full bg-white'
      >
        <ul className='container-site flex flex-col py-2'>
          {links.map((link) => {
            const isActive = activeId === idFromHref(link.href);
            return (
              <li key={link.href}>
                <button
                  type='button'
                  onClick={() => {
                    scrollToSection(link.href);
                    setIsOpen(false);
                  }}
                  aria-current={isActive ? 'true' : undefined}
                  className={[
                    'block w-full border-l-2 py-3 pl-3 text-left text-base font-bold transition-colors',
                    isActive
                      ? 'border-brand text-brand'
                      : 'border-transparent text-brand hover:border-brand/40',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
                  ].join(' ')}
                >
                  {link.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}
