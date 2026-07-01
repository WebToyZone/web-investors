import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  // supported locales
  locales: ['en', 'es'],

  // default locale
  defaultLocale: 'en',

  // Always show the locale in the URL
  // /en
  // /es
  localePrefix: 'always'
});

export type Locale = (typeof routing.locales)[number];