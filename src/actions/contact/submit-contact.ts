'use server';

import { ContactSchema } from '@/schemas/contact.schema';
import { sendAutoReplyEmail } from '@/services/email/send-auto-reply-email';
import { sendContactEmail } from '@/services/email/send-contact-email';
import { Locale } from '@/types/locale';

export type ContactActionResponse = {
  success?: string;
  error?: string;
};

export async function submitContact(
  values: unknown,
  locale: Locale,
): Promise<ContactActionResponse> {
  const validatedFields = ContactSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error:
        locale === 'es'
          ? 'Por favor, revisa los campos del formulario.'
          : 'Please check the form fields.',
    };
  }

  const data = validatedFields.data;

  try {
    await sendContactEmail(data, locale);
    await sendAutoReplyEmail(data, locale);

    return {
      success:
        locale === 'es'
          ? 'Tu mensaje se ha enviado correctamente.'
          : 'Your message has been sent successfully.',
    };
  } catch (error) {
    console.error('Contact form error:', error);

    return {
      error:
        locale === 'es'
          ? 'No se pudo enviar el mensaje. Inténtalo de nuevo.'
          : 'The message could not be sent. Please try again.',
    };
  }
}
