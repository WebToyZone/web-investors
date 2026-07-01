"use server";

import type { ContactFormValues } from "@/components/sections/ContactSection";

/**
 * Server action for the investor contact form.
 *
 * Wire this up to your delivery channel (transactional email, CRM, DB record,
 * etc.). Kept intentionally minimal — validate and persist as needed.
 */
export async function submitContact(values: ContactFormValues): Promise<void> {
  // TODO: validate server-side and deliver the message (email / CRM / Prisma).
  console.log("Contact form submission:", values);
}
