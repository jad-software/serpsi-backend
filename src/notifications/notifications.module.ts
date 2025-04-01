import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { MailingService } from './mailing.service';
import { HandlebarsService } from './handlebars.service';

@Module({
  controllers: [NotificationsController],
  providers: [MailingService, HandlebarsService],
  exports: [MailingService],
})
export class NotificationsModule {}
