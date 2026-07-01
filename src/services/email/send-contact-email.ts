import { ContactFormInput } from '@/schemas/contact.schema';
import { Locale } from '@/types/locale';
import { emailClient } from './client';

const contactEmailCopy = {
  en: {
    subject: 'New contact from EOLO Investors',
    title: 'New Investor Contact',
    intro:
      'A new contact request has been submitted through the EOLO Investors website.',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    message: 'Message',
    consent: 'Consent',
    consentValue: 'Accepted',
  },
  es: {
    subject: 'Nuevo contacto desde EOLO Investors',
    title: 'Nuevo contacto de inversores',
    intro:
      'Se ha recibido una nueva solicitud de contacto desde la web de EOLO Investors.',
    name: 'Nombre',
    email: 'Email',
    phone: 'Teléfono',
    message: 'Mensaje',
    consent: 'Consentimiento',
    consentValue: 'Aceptado',
  },
} as const;

export async function sendContactEmail(data: ContactFormInput, locale: Locale) {
  const t = contactEmailCopy[locale];

  const language = locale === 'es' ? 'Spanish' : 'English';

  const receivedAt = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  }).format(new Date());

  const { error } = await emailClient.emails.send({
    from: process.env.CONTACT_FROM_EMAIL!,
    to: process.env.CONTACT_TO_EMAIL!,
    subject: `${t.subject} | ${data.name} <${data.email}>`,
    replyTo: data.email,
    html: `
      <div style="font-family: Arial, Helvetica, sans-serif; color:#333; line-height:1.6;">
        <h2 style="color:#C8002D;">${t.title}</h2>

        <p>${t.intro}</p>

        <table style="width:100%; border-collapse:collapse; margin-top:20px;">
          <tbody>
            <tr>
              <td style="padding:10px;border:1px solid #ddd;"><strong>${t.name}</strong></td>
              <td style="padding:10px;border:1px solid #ddd;">${data.name}</td>
            </tr>

            <tr>
              <td style="padding:10px;border:1px solid #ddd;"><strong>${t.email}</strong></td>
              <td style="padding:10px;border:1px solid #ddd;">
                <a href="mailto:${data.email}">${data.email}</a>
              </td>
            </tr>

            <tr>
              <td style="padding:10px;border:1px solid #ddd;"><strong>${t.phone}</strong></td>
              <td style="padding:10px;border:1px solid #ddd;">${data.phone}</td>
            </tr>

            <tr>
              <td style="padding:10px;border:1px solid #ddd;"><strong>${t.message}</strong></td>
              <td style="padding:10px;border:1px solid #ddd; white-space:pre-wrap;">${data.message}</td>
            </tr>

            <tr>
              <td style="padding:10px;border:1px solid #ddd;"><strong>${t.consent}</strong></td>
              <td style="padding:10px;border:1px solid #ddd;">${t.consentValue}</td>
            </tr>
          </tbody>
        </table>
        <hr style="margin:32px 0;border:none;border-top:1px solid #e5e5e5;" />

        <h3 style="color:#666;font-size:14px;margin-bottom:12px;">
          Technical Information
        </h3>

        <table style="width:100%;border-collapse:collapse;">
          <tbody>
            <tr>
              <td style="padding:8px 0;font-weight:bold;">Submitted from</td>
              <td>EOLO Investors Website</td>
            </tr>

            <tr>
              <td style="padding:8px 0;font-weight:bold;">Language</td>
              <td>${language}</td>
            </tr>

            <tr>
              <td style="padding:8px 0;font-weight:bold;">Received</td>
              <td>${receivedAt} UTC</td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }
}
