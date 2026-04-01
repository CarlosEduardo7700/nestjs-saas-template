interface WelcomeEmailData {
  appName: string;
  name: string;
  loginUrl: string;
}

interface PasswordResetData {
  appName: string;
  resetUrl: string;
  expiresIn: string;
}

interface PasswordResetSuccessData {
  appName: string;
  loginUrl: string;
}

interface PaymentSuccessData {
  appName: string;
  planName: string;
  dashboardUrl: string;
}

const baseStyles: string = `
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #2563eb;
      margin: 0;
      font-size: 24px;
    }
    .content {
      margin-bottom: 30px;
    }
    .content p {
      margin: 0 0 15px 0;
    }
    .button {
      display: inline-block;
      background-color: #2563eb;
      color: #ffffff !important;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 6px;
      font-weight: 600;
      text-align: center;
    }
    .button:hover {
      background-color: #1d4ed8;
    }
    .button-container {
      text-align: center;
      margin: 25px 0;
    }
    .footer {
      text-align: center;
      color: #666;
      font-size: 12px;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }
    .warning {
      background-color: #fef3c7;
      border: 1px solid #f59e0b;
      border-radius: 6px;
      padding: 15px;
      margin: 20px 0;
      font-size: 14px;
    }
    .success-icon {
      font-size: 48px;
      text-align: center;
      margin-bottom: 20px;
    }
  </style>
`;

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
