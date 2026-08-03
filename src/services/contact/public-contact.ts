import { prisma } from '@/services/db/client';
import type { ContactInfo as PublicContactInfo } from '@/components/sections/ContactSection';
import type { ContactAddressTranslation, Locale } from '@/components/admin/types';

/**
 * The contact details shown next to the form, read from the same row the admin
 * writes to. The labels around them — heading, field placeholders, consent
 * text — stay in the static content: they are i18n copy, not contact data.
 *
 * Returns null when there is no row at all, so the caller can fall back rather
 * than render an empty address block.
 */
export async function getPublicContact(
  locale: Locale,
): Promise<PublicContactInfo | null> {
  const settings = await prisma.contactSettings.findUnique({ where: { id: 1 } });
  if (!settings) {
    return null;
  }

  const translations = settings.translations as unknown as Record<
    Locale,
    Partial<ContactAddressTranslation> | undefined
  > | null;

  // Rows written before the address became translatable keep it in the flat
  // columns; fall back to them so neither language renders blank.
  const addressLines = [
    translations?.[locale]?.addressLine1 ?? settings.addressLine1,
    translations?.[locale]?.addressLine2 ?? settings.addressLine2,
  ].filter((line) => line.trim());

  return {
    email: settings.email,
    phone: settings.phone,
    addressLines,
  };
}
