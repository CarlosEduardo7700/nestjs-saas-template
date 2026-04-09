import { PasswordResetData } from './interfaces/email-data.interface';
import { baseStyles } from './styles/base-emails.styles';

export function getPasswordResetTemplate(data: PasswordResetData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      ${baseStyles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${data.appName}</h1>
        </div>
        <div class="content">
          <p>Hi,</p>
          <p>We received a request to reset the password for your ${data.appName} account.</p>
          <p>Click the button below to reset your password:</p>
          <div class="button-container">
            <a href="${data.resetUrl}" class="button">Reset Password</a>
          </div>
          <div class="warning">
            <strong>⚠️ Important:</strong> This link will expire in ${data.expiresIn}. If you didn't request a password reset, you can safely ignore this email.
          </div>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; font-size: 12px; color: #666;">${data.resetUrl}</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ${data.appName}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
