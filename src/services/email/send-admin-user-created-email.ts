import { headers } from 'next/headers';
import { emailClient } from './client';

const FALLBACK_ORIGIN = 'http://localhost:3000';

/**
 * Where the recipient has to log in.
 *
 * Read from the request the administrator was on, so it is correct in
 * development, in previews and in production without anything to configure —
 * `NEXT_PUBLIC_SITE_URL` was never set outside local, which is why these
 * emails were pointing everyone at localhost.
 *
 * The variable still wins when present, to force a canonical domain.
 */
async function resolveLoginUrl(): Promise<string> {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    return `${configured.replace(/\/$/, '')}/admin/login`;
  }

  try {
    const requestHeaders = await headers();
    const host = requestHeaders.get('host');

    if (host) {
      // Behind more than one proxy the header arrives as a list; the first
      // entry is the protocol the browser actually used.
      const forwarded = requestHeaders
        .get('x-forwarded-proto')
        ?.split(',')[0]
        ?.trim();

      const isLocal = /^(localhost|127\.0\.0\.1|\[::1\])(:|$)/.test(host);
      const protocol = forwarded || (isLocal ? 'http' : 'https');

      return `${protocol}://${host}/admin/login`;
    }
  } catch {
    // Called outside a request (a script, a job): fall through.
  }

  return `${FALLBACK_ORIGIN}/admin/login`;
}

function credentialsEmailHtml({
  title,
  intro,
  name,
  email,
  temporaryPassword,
  loginUrl,
}: {
  title: string;
  intro: string;
  name: string;
  email: string;
  temporaryPassword: string;
  loginUrl: string;
}) {
  return `
    <div style="font-family: Arial, Helvetica, sans-serif; color:#333; line-height:1.6;">
      <h2 style="color:#C8002D;">${title}</h2>

      <p>Hola ${name},</p>
      <p>${intro}</p>

      <table style="width:100%; border-collapse:collapse; margin-top:20px;">
        <tbody>
          <tr>
            <td style="padding:10px;border:1px solid #ddd;"><strong>Email</strong></td>
            <td style="padding:10px;border:1px solid #ddd;">${email}</td>
          </tr>
          <tr>
            <td style="padding:10px;border:1px solid #ddd;"><strong>Contrasena temporal</strong></td>
            <td style="padding:10px;border:1px solid #ddd;"><code>${temporaryPassword}</code></td>
          </tr>
        </tbody>
      </table>

      <p style="margin-top:20px;">
        Ingresa en
        <a href="${loginUrl}">${loginUrl}</a>
        con estos datos.
      </p>
    </div>
  `;
}

export async function sendAdminUserCreatedEmail({
  name,
  email,
  temporaryPassword,
}: {
  name: string;
  email: string;
  temporaryPassword: string;
}) {
  const { error } = await emailClient.emails.send({
    from: process.env.CONTACT_FROM_EMAIL!,
    to: email,
    subject: 'Se creo tu acceso al admin de EOLO Investors',
    html: credentialsEmailHtml({
      title: 'Bienvenido al admin de EOLO Investors',
      intro:
        'Se creo una cuenta para vos en el panel de administracion de EOLO Investors. Estos son tus datos de acceso:',
      name,
      email,
      temporaryPassword,
      loginUrl: await resolveLoginUrl(),
    }),
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function sendAdminUserPasswordResetEmail({
  name,
  email,
  temporaryPassword,
}: {
  name: string;
  email: string;
  temporaryPassword: string;
}) {
  const { error } = await emailClient.emails.send({
    from: process.env.CONTACT_FROM_EMAIL!,
    to: email,
    subject: 'Tu contrasena del admin de EOLO Investors fue restablecida',
    html: credentialsEmailHtml({
      title: 'Contrasena restablecida',
      intro:
        'Se genero una nueva contrasena temporal para tu cuenta en el admin de EOLO Investors:',
      name,
      email,
      temporaryPassword,
      loginUrl: await resolveLoginUrl(),
    }),
  });

  if (error) {
    throw new Error(error.message);
  }
}
