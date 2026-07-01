'use client';

/**
 * Data shapes for the site footer.
 */
export interface FooterLink {
  label: string;
  href: string;
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

export default function FooterLinkGroups({
  link,
  key,
}: {
  link: FooterLink;
  key: string;
}) {
  return (
    <li key={key}>
      <button
        type='button'
        onClick={() => scrollToSection(link.href)}
        className='text-md text-white transition-colors hover:text-white/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white cursor-pointer'
      >
        {link.label}
      </button>
    </li>
  );
}
