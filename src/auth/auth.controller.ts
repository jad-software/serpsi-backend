import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guards';
import { JwtAuthGuard } from './guards/jwt.guards';
import { Public } from '../constants';
import { User } from './providers/user.decorator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDTO } from './dto/login.dto';
import { RolesGuard } from './guards/roles.guards';
import { Roles } from './providers/roles.decorator';
import { Role } from '../users/vo/role.enum';
import { MailingService } from './mailing.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly mailingService: MailingService
  ) { }

  @Public()
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDTO })
  @ApiOperation({ summary: 'Faz login com email e senha' })
  @Post('login')
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: 'futura rota de registro' })
  @Post('register')
  async register(@Req() req) {
    //return this.authService.register(req.user);
    return 'not implemented yet';
  }
  @ApiOperation({ summary: 'teste como funciona o JWT vai' })
  @Roles(Role.PSYCHOLOGIST)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@User() user) {
    return user;
  }
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
  async sendEmail(@Body('user') user: { id: string, email: string, name: string }) {
    return  await this.mailingService.sendUserConfirmation(user, user.id);
  }
}
