import * as nodemailer from 'nodemailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { mailingService } from '../constants';
import { HandlebarsService } from './handlebars.service';

@Injectable()
export class MailingService {
  private transporter: nodemailer.Transporter;
  private confirmationTemplate: Handlebars.TemplateDelegate;
  private passwordResetTemplate: Handlebars.TemplateDelegate;

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
    // Load Handlebars templates

    this.confirmationTemplate = this.handleBarsService.compileTemplate('confirmation', "Confirmação de email");
    // this.passwordResetTemplate = this.loadTemplate('passwordReset');
  }


  async sendUserConfirmation(
    user: { id: string; email: string; name: string },
    token: string
  ) {
    const confirmationUrl = `${mailingService.CLIENT_URL}?token=${token}`;
    const emailBody = this.confirmationTemplate({ confirmationUrl: confirmationUrl, user: user });
    try {
      await this.transporter.sendMail({
        to: user.email,
        subject: 'Welcome user! Confirm your Email',
        html: emailBody,
      });
      return {
        message: 'Email enviado com sucesso! para ' + user.email,
        statusCode: 200,
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('erro ao enviar o email');
    }
  }

  verifyTransporterConnection() {
    this.transporter.verify(function (error, success) {
      if (error) {
        console.error('Error connecting to the transporter:', error);
        throw new InternalServerErrorException('erro ao enviar o email');
      }
      console.log('Server is ready to take our messages');
    });
  }
}
