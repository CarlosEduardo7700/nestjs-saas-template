import { WelcomeEmailData } from './interfaces/email-data.interface';
import { baseStyles } from './styles/base-emails.styles';

export function getWelcomeEmailTemplate(data: WelcomeEmailData): string {
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
          <p>Hi ${data.name},</p>
          <p>Welcome to <strong>${data.appName}</strong>! We're excited to have you on board.</p>
          <p>Your account is ready to use. You can start exploring all the features right away.</p>
          <div class="button-container">
            <a href="${data.loginUrl}" class="button">Go to Dashboard</a>
          </div>
          <p>If you have any questions, feel free to reach out to our support team.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ${data.appName}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
