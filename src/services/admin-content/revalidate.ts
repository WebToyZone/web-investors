import { revalidatePath } from 'next/cache';

/**
 * The public page is prerendered once per locale, so an admin edit stays
 * invisible to visitors until that prerender is dropped. Every write that
 * feeds a public section has to call this; `/admin` itself is revalidated
 * separately because it is the only page that shows unpublished state.
 */
export function revalidatePublicSite(): void {
  revalidatePath('/[locale]', 'page');
}
