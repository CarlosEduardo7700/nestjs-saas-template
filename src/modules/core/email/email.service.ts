import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import {
  getWelcomeEmailTemplate,
  getPasswordResetTemplate,
  getPaymentSuccessTemplate,
  getPasswordResetSuccessTemplate,
} from './templates/email.templates';

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend;
  private fromEmail: string;
  private appName: string;
  private frontendUrl: string;

  constructor(private configService: ConfigService) {
    const apiKey: string | undefined =
      this.configService.get<string>('RESEND_API_KEY');

    if (!apiKey) {
      throw new InternalServerErrorException(
        'RESEND_API_KEY is not configured',
      );
    }

    this.resend = new Resend(apiKey);
    this.fromEmail =
      this.configService.get<string>('EMAIL_FROM') || 'onboarding@resend.dev';
    this.appName =
      this.configService.get<string>('APP_NAME') || 'NestJS SaaS App';
    this.frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
  }

  async sendEmail(options: SendEmailOptions): Promise<void> {
    try {
      await this.resend.emails.send({
        from: `${this.appName} <${this.fromEmail}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
    } catch (error) {
      this.logger.error('Failed to send email:', error);
      throw new InternalServerErrorException('Failed to send email');
    }
  }

  async sendWelcomeEmail(email: string, name?: string): Promise<void> {
    const html: string = getWelcomeEmailTemplate({
      appName: this.appName,
      name: name || email.split('@')[0],
      loginUrl: `${this.frontendUrl}/login`,
    });

    await this.sendEmail({
      to: email,
      subject: `Welcome to ${this.appName}!`,
      html,
    });
  }

  async sendPasswordResetEmail(
    email: string,
    resetToken: string,
  ): Promise<void> {
    const resetUrl: string = `${this.frontendUrl}/reset-password?token=${resetToken}`;

    const html: string = getPasswordResetTemplate({
      appName: this.appName,
      resetUrl,
      expiresIn: '1 hour',
    });

    await this.sendEmail({
      to: email,
      subject: `Reset your ${this.appName} password`,
      html,
    });
  }

  async sendPasswordResetSuccessEmail(email: string): Promise<void> {
    const html: string = getPasswordResetSuccessTemplate({
      appName: this.appName,
      loginUrl: `${this.frontendUrl}/login`,
    });

    await this.sendEmail({
      to: email,
      subject: `Your ${this.appName} password has been reset`,
      html,
    });
  }

  async sendPaymentSuccessEmail(
    email: string,
    planName: string = 'Premium',
  ): Promise<void> {
    const html: string = getPaymentSuccessTemplate({
      appName: this.appName,
      planName,
      dashboardUrl: `${this.frontendUrl}/dashboard`,
    });

    await this.sendEmail({
      to: email,
      subject: `Welcome to ${this.appName} ${planName}!`,
      html,
    });
  }
}
