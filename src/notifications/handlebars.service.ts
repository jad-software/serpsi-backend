import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HandlebarsService {
  private templatesDir = path.join(__dirname, '..', 'notifications', 'templates');

  constructor() {
    // Registra os partials ao iniciar o serviço
    this.registerPartials();
  }

  private registerPartials() {
    const partialsDir = path.join(this.templatesDir, 'partials');
    const partialFiles = fs.readdirSync(partialsDir);

    partialFiles.forEach((file) => {
      const partialName = path.basename(file, '.hbs');
      const partialContent = fs.readFileSync(path.join(partialsDir, file), 'utf-8');
      Handlebars.registerPartial(partialName, partialContent);
    });
  }

  /**
   * Compila um template com o layout, sem preencher os dados.
   * @param templateName Nome do template (ex: 'confirm-email')
   * @param subject Titulo do email (ex: 'confirmação de email')
   * @returns HTML com o layout + corpo do e-mail, mas sem dados
   */
  compileTemplate(templateName: string, subject: string): Handlebars.TemplateDelegate {
    const layoutPath = path.join(this.templatesDir, 'layout.hbs');
    const layout = fs.readFileSync(layoutPath, 'utf-8');

    const templatePath = path.join(this.templatesDir, `${templateName}.hbs`);
    const template = fs.readFileSync(templatePath, 'utf-8');

    const compiledLayout = Handlebars.compile(layout);
    return Handlebars.compile(compiledLayout({ subject, body: template }));
  }
}
