import { PasswordResetSuccessData } from './interfaces/email-data.interface';
import { baseStyles } from './styles/base-emails.styles';

export function getPasswordResetSuccessTemplate(
  data: PasswordResetSuccessData,
): string {
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
          <div class="success-icon">✅</div>
          <p>Hi,</p>
          <p>Your password has been successfully reset.</p>
          <p>You can now log in to your account with your new password.</p>
          <div class="button-container">
            <a href="${data.loginUrl}" class="button">Log In</a>
          </div>
          <div class="warning">
            <strong>⚠️ Security Notice:</strong> If you didn't make this change, please contact our support team immediately.
          </div>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ${data.appName}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
