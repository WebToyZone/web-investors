import { ContactFormInput } from '@/schemas/contact.schema';
import { Locale } from '@/types/locale';
import { emailClient } from './client';

const autoReplyCopy = {
  en: {
    subject: 'Thank you for contacting EOLO Investors',
    title: 'Thank you for contacting EOLO Investors',
    greeting: 'Dear',
    line1: 'Thank you for your interest in EOLO Investors.',
    line2:
      'We have successfully received your message and our Investor Relations team will review your enquiry as soon as possible.',
    line3:
      'This is an automatic confirmation email. Please do not reply to this message.',
    closing: 'Kind regards',
    signature: 'EOLO Investors',
  },
  es: {
    subject: 'Gracias por contactar con EOLO Investors',
    title: 'Gracias por contactar con EOLO Investors',
    greeting: 'Hola',
    line1: 'Gracias por tu interés en EOLO Investors.',
    line2:
      'Hemos recibido correctamente tu mensaje y nuestro equipo de Relación con Inversores lo revisará lo antes posible.',
    line3:
      'Este es un email de confirmación automático. Por favor, no respondas a este mensaje.',
    closing: 'Un saludo',
    signature: 'EOLO Investors',
  },
} as const;

export async function sendAutoReplyEmail(
  data: ContactFormInput,
  locale: Locale,
) {
  const t = autoReplyCopy[locale];
  const firstName = data.name.trim().split(' ')[0];

  const { error } = await emailClient.emails.send({
    from: process.env.CONTACT_FROM_EMAIL!,
    to: data.email,
    subject: t.subject,
    html: `
      <div style="font-family: Arial, Helvetica, sans-serif; color:#333; line-height:1.7;">
        <h2 style="color:#C8002D;">${t.title}</h2>

        <p>${t.greeting} <strong>${firstName}</strong>,</p>

        <p>${t.line1}</p>

        <p>${t.line2}</p>

        <p>${t.line3}</p>

        <br />

        <p>${t.closing},</p>

        <strong>${t.signature}</strong>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }
}