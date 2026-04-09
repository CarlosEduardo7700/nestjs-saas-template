export interface WelcomeEmailData {
  appName: string;
  name: string;
  loginUrl: string;
}

export interface PasswordResetData {
  appName: string;
  resetUrl: string;
  expiresIn: string;
}

export interface PasswordResetSuccessData {
  appName: string;
  loginUrl: string;
}

export interface PaymentSuccessData {
  appName: string;
  planName: string;
  dashboardUrl: string;
}
