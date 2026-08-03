/**
 * How the contact address is split between the shared part and the country.
 *
 * `addressLine2` is stored twice for different purposes: the flat column holds
 * the locality alone, which reads the same in every language, and each entry
 * in `translations` holds that locality joined to its own country name. Both
 * the admin form and the save path compose it through here so the rule cannot
 * drift between them.
 */

/** What goes between the locality and the country. */
export const COUNTRY_SEPARATOR = ', ';

/**
 * Splits a stored line back into the two fields that produced it.
 *
 * The country is free text, so there is nothing to recognise it by — the split
 * happens at the *last* comma, which is where `joinAddressLine2` put it. A
 * locality with commas of its own ("33202, Gijón, Asturias") survives intact,
 * since only the final one counts as the boundary.
 */
export function splitAddressLine2(addressLine2: string): {
  locality: string;
  country: string;
} {
  const boundary = addressLine2.lastIndexOf(',');
  if (boundary === -1) {
    return { locality: addressLine2, country: '' };
  }

  const country = addressLine2.slice(boundary + 1);

  return {
    locality: addressLine2.slice(0, boundary),
    // Drops only the single space the separator adds, so a space typed inside
    // the country field is not eaten on the way back.
    country: country.startsWith(' ') ? country.slice(1) : country,
  };
}

/**
 * Joins the two fields for storage.
 *
 * Nothing is trimmed and the separator is always written, even with an empty
 * country: the form's values are derived back through `splitAddressLine2`, so
 * normalising here would delete characters as they are typed — a comma at the
 * end of the locality, or the separator that marks where the country starts.
 */
export function joinAddressLine2(locality: string, country: string): string {
  return `${locality}${COUNTRY_SEPARATOR}${country}`;
}
