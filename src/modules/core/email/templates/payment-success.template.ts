import { PaymentSuccessData } from './interfaces/email-data.interface';
import { baseStyles } from './styles/base-emails.styles';

export function getPaymentSuccessTemplate(data: PaymentSuccessData): string {
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
          <div class="success-icon">🎉</div>
          <p>Hi,</p>
          <p>Thank you for subscribing to <strong>${data.appName} ${data.planName}</strong>!</p>
          <p>Your payment was successful and your account has been upgraded. You now have access to all premium features.</p>
          <div class="button-container">
            <a href="${data.dashboardUrl}" class="button">Go to Dashboard</a>
          </div>
          <p>Here's what you can do now:</p>
          <ul>
            <li>Access all premium features</li>
            <li>Priority customer support</li>
            <li>Early access to new features</li>
          </ul>
          <p>Thank you for your trust in us!</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ${data.appName}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
