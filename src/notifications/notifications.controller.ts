import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { MailingService } from './mailing.service';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly mailingService: MailingService) {}

  @ApiOperation({ summary: 'envio de email para o usuário' })
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'c9ac7c93-5c96-4b29-8225-2f9f51756018',
            },
            email: {
              type: 'string',
              example: 'teste@serpsi.com',
            },
            name: {
              type: 'string',
              example: 'teste',
            },
          },
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Post('send-email')
  async sendEmail(
    @Body('user') user: { id: string; email: string; name: string }
  ) {
    return await this.mailingService.sendUserConfirmation(user, user.id);
  }
}
