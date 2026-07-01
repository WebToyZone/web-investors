'use client';

import {useLocale} from 'next-intl';
import {usePathname, useRouter} from '@/i18n/navigation';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function changeLocale(locale: 'en' | 'es') {
    router.replace(pathname, {locale});
  }

  return (
    <div className="flex items-center gap-1 font-medium text-lg">
      <button
        onClick={() => changeLocale('en')}
        className={locale === 'en' ? 'text-brand' : 'text-gray-500 cursor-pointer'}
      >
        EN
      </button>

      <span className="text-gray-300">|</span>

      <button
        onClick={() => changeLocale('es')}
        className={locale === 'es' ? 'text-brand' : 'text-gray-500 cursor-pointer'}
      >
        ES
      </button>
    </div>
  );
}