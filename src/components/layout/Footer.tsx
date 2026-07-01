import Image from 'next/image';
import Link from 'next/link';
import { IconType } from 'react-icons';
import FooterLinkGroups from './FooterLinkGroups';

/**
 * Data shapes for the site footer.
 *
 * Fed statically from `data/investorsData.ts` for now; plain serialisable fields
 * keep it ready to come from a Prisma-backed CMS later.
 */
export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterLinkGroup {
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  /** Platform name, used as the accessible label. */
  label: string;
  href: string;
  /** Monochrome (white) icon asset for the platform. */
  icon: IconType;
}

export interface FooterContent {
  logo: { src: string; alt: string };
  groups: FooterLinkGroup[];
  social: {
    title: string;
    links: SocialLink[];
  };
  copyright: string;
  legalLinks: FooterLink[];
}

export interface FooterProps {
  content: FooterContent;
}

/**
 * Brand-red site footer: logo, link groups, social links and a legal bar.
 * Static / presentational — safe as a Server Component.
 */
export default function Footer({ content }: FooterProps) {
  const { logo, groups, social, copyright, legalLinks } = content;

  return (
    <footer className='bg-brand text-white'>
      <div className='container-site py-14'>
        <div className='grid grid-cols-2 gap-10 xl:grid-cols-5 lg:gap-12'>
          {/* Logo */}
          <div className='col-span-2 flex items-center justify-center md:col-span-1 xl:col-span-2 xl:justify-start'>
            <Image
              src={logo.src}
              alt={logo.alt}
              className='h-auto w-64 max-w-full -rotate-6'
              width={384}
              height={216}
            />
          </div>

          {/* Link groups */}
          {groups.map((group) => (
            <nav
              key={group.title}
              aria-label={group.title}
              className='text-center xl:text-left'
            >
              <h2 className='font-heading text-2xl uppercase tracking-wider'>
                {group.title}
              </h2>
              <ul className='mt-3 space-y-1'>
                {group.links.map((link) => (
                  <FooterLinkGroups key={`${group.title}-${link.label}`} link={link} />                 
                ))}
              </ul>
            </nav>
          ))}

          {/* Social */}
          <div className='col-span-2 flex flex-col items-center text-center md:col-span-1 xl:items-start xl:text-left'>
            <h2 className='font-heading text-2xl uppercase tracking-wider'>
              {social.title}
            </h2>
            <ul className='mt-5 flex items-center gap-3'>
              {social.links.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-label={item.label}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex h-9 w-9 items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
                  >
                    <item.icon className='h-7 w-7' aria-hidden='true' />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className='mt-8 xl:mt-12 border-white/30' />

        {/* Legal bar */}
        <div className='mt-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
          <p className='max-w-3xl text-md font-condensed text-white/80 text-center xl:text-left'>
            {copyright}
          </p>
          <ul className='flex flex-wrap items-center gap-x-3 gap-y-2 text-md font-condensed justify-center xl:justify-start mt-2 lg:mt-0'>
            {legalLinks.map((link, index) => (
              <li key={link.href} className='flex items-center gap-3'>
                {index > 0 ? (
                  <span aria-hidden='true' className='text-white/50'>
                    |
                  </span>
                ) : null}
                <Link
                  href={link.href}
                  className='underline underline-offset-2 hover:text-white/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
