import { emailClient } from './client';

function loginUrl() {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  return `${base.replace(/\/$/, '')}/admin/login`;
}

function credentialsEmailHtml({
  title,
  intro,
  name,
  email,
  temporaryPassword,
}: {
  title: string;
  intro: string;
  name: string;
  email: string;
  temporaryPassword: string;
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
        <a href="${loginUrl()}">${loginUrl()}</a>
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
    }),
  });

  if (error) {
    throw new Error(error.message);
  }
}
