import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  const requestedLocale = await requestLocale;

  const locale = hasLocale(routing.locales, requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;

  const messages = {
    common: (await import(`../messages/${locale}/common.json`)).default,
    navbar: (await import(`../messages/${locale}/navbar.json`)).default,
    footer: (await import(`../messages/${locale}/footer.json`)).default,
    home: (await import(`../messages/${locale}/home.json`)).default
  };

  return {
    locale,
    messages
  };
});