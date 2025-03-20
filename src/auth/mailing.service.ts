import * as nodemailer from 'nodemailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { mailingService } from '../constants';

@Injectable()
export class MailingService {
  private transporter: nodemailer.Transporter;
  private confirmationTemplate: handlebars.TemplateDelegate;
  private passwordResetTemplate: handlebars.TemplateDelegate;

  constructor() {
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
      },
    );
    this.verifyTransporterConnection()
    // Load Handlebars templates

    // this.confirmationTemplate = this.loadTemplate('confirmation.hbs');
    // this.passwordResetTemplate = this.loadTemplate('passwordReset.hbs');
  }

  private loadTemplate(templateName: string): handlebars.TemplateDelegate {
    const templatesFolderPath = path.join(__dirname, './templates');
    const templatePath = path.join(templatesFolderPath, templateName);

    const templateSource = fs.readFileSync(templatePath, 'utf8');
    return handlebars.compile(templateSource);
  }

  async sendUserConfirmation(user: { id: string, email: string, name: string }, token: string) {
    const confirmationLink = `${mailingService.CLIENT_URL}?token=${token}`;
    const emailBody = `
    <h1>Hello ${user.name},<h1>
    \n
    \n
    <p>Welcome to our platform! Please click on the following link to confirm your email address: ${confirmationLink}
    \n\n
    Regards,
    \nThe Team<p>`;


    try {
      await this.transporter.sendMail({
        to: user.email,
        subject: 'Welcome user! Confirm your Email',
        html: emailBody,
      });
      return {
        message: 'Email enviado com sucesso! para' + user.email,
        statusCode: 200
      }
    }
    catch (err) {
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
      console.log("Server is ready to take our messages");
    });
  }
}