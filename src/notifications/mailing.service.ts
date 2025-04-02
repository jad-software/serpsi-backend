import * as nodemailer from 'nodemailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HandlebarsService } from './handlebars.service';
import { mailingService } from 'src/constants';

@Injectable()
export class MailingService {
  private transporter: nodemailer.Transporter;
  private templates: Record<string, Handlebars.TemplateDelegate>;

  constructor(private readonly handleBarsService: HandlebarsService) {
    this.transporter = nodemailer.createTransport(
      {
        service: mailingService.SERVICE_TYPE,
        host: mailingService.MAIL_HOST,
        port: Number(mailingService.MAIL_PORT),
        secure: mailingService.MAILER_SECURE === 'true',
        auth: {
          user: mailingService.MAIL_USER,
          pass: mailingService.MAIL_PASSWORD,
        },
      },
      {
        from: {
          name: `(No-reply) SerPSI - agenda <${mailingService.MAIL_FROM}>`,
          address: mailingService.MAIL_FROM,
        },
      }
    );

    this.verifyTransporterConnection();

    this.templates = {
      confirmation: this.handleBarsService.compileTemplate('confirmation', 'Confirmação de email'),
      passwordReset: this.handleBarsService.compileTemplate('passwordReset', 'Redefinição de senha'),
    };
  }

  private verifyTransporterConnection() {
    this.transporter.verify(function (error, success) {
      if (error) {
        console.error('Error connecting to the transporter:', error);
        throw new InternalServerErrorException('erro ao enviar o email');
      }
      console.log('Server is ready to send E-mails');
    });
  }

  private async sendEmail(to: string, subject: string, templateKey: string, data: object) {
    try {
      const emailBody = this.templates[templateKey](data);

      await this.transporter.sendMail({
        to,
        subject,
        html: emailBody,
      });

      return {  
        message: `Email enviado com sucesso para ${to}`,
        statusCode: 200,
      };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Erro ao enviar o email');
    }
  }

  async sendUserConfirmation(user: { email: string; name: string }, token: string) {
    const confirmationUrl = `${mailingService.CLIENT_URL}/confirm/${token}`;
    return this.sendEmail(user.email, 'Bem vindo! Confirme seu e-mail', 'confirmation', {
      confirmationUrl,
      user,
    });
  }

  async sendPasswordReset(user: { email: string; name: string }, token: string) {
    const resetUrl = `${mailingService.CLIENT_URL}/forgot-password/${token}`;
    return this.sendEmail(user.email, 'Redefinição de senha', 'passwordReset', {
      resetUrl,
      user,
    });
  }
}
