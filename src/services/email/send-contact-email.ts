import { ContactFormInput } from '@/schemas/contact.schema';
import { Locale } from '@/types/locale';
import { prisma } from '@/services/db/client';
import { emailClient } from './client';

const contactEmailCopy = {
  subject: 'New contact from EOLO Investors',
    title: 'New Investor Contact',
    intro:
      'A new contact request has been submitted through the EOLO Investors website.',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    message: 'Message',
} as const;

export async function sendContactEmail(data: ContactFormInput, locale: Locale) {
  const t = contactEmailCopy;

  const language = locale === 'es' ? 'Spanish' : 'English';

  const receivedAt = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  }).format(new Date());

  const contactSettings = await prisma.contactSettings.findUnique({
    where: { id: 1 },
  });
  const recipient = contactSettings?.recipientEmail || process.env.CONTACT_TO_EMAIL!;

  const { error } = await emailClient.emails.send({
    from: process.env.CONTACT_FROM_EMAIL!,
    to: recipient,
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

          </tbody>
        </table>
        <hr style="margin:32px 0;border:none;border-top:1px solid #e5e5e5;" />

        <h3 style="color:#666;font-size:14px;margin-bottom:12px;">
          Información sobre el contacto:
        </h3>

        <table style="width:100%;border-collapse:collapse;">
          <tbody>
            <tr>
              <td style="padding:8px 0;font-weight:bold;">Enviado desde</td>
              <td>EOLO Investors Website</td>
            </tr>

            <tr>
              <td style="padding:8px 0;font-weight:bold;">Recibido</td>
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
