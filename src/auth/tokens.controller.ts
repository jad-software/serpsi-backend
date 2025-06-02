import { Body, Controller, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { TokensService } from "./tokens.service";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { LocalAuthGuard } from "./guards/local.guards";
import { Public } from "src/constants";
import { TokenDTO } from "./dto/token.dto";
import { UsersService } from "src/users/users.service";
import { Email } from "src/users/vo/email.vo";
import { ForgotPasswordDto } from "./dto/forgotpassword.dto";
import { MailingService } from "src/notifications/mailing.service";
import { JwtAuthGuard } from "./guards/jwt.guards";

@ApiTags('auth')
@Controller('token')
export class TokensController {
  constructor(
    private readonly tokensService: TokensService,
    private readonly userService: UsersService,
    private readonly mailingService: MailingService
  ) { }

  @Public()
  @UseGuards(JwtAuthGuard)
  @ApiBody({
    type: TokenDTO
  })
  @ApiOperation({ summary: 'Confirma o email de um usuário com token valido' })
  @Patch('confirmUser')
  async confirmUser(@Body() tokenDto: TokenDTO) {
    return this.tokensService.use(
      tokenDto.token,
      async (email: Email) => await this.userService.confirmUser(email.email)
    );
  }

  @Public()
  @UseGuards(JwtAuthGuard)
  @ApiBody({
    type: ForgotPasswordDto
  })
  @ApiOperation({ summary: 'muda a senha de um usuário de um usuário com token valido' })
  @Patch('forgotPassword')
  async changePassword(@Body() tokenDto: ForgotPasswordDto) {
    return this.tokensService.use(
      tokenDto.token,
      async (email: Email) => await this.userService.changePasswordByToken(email.email, tokenDto)
    );
  }

  @Public()
  @UseGuards(JwtAuthGuard)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'teste@serpsi.com',
        },
      },
    }
  })
  @ApiOperation({ summary: 'gera um token e envia por email para recuperação de senha' })
  @Post('generate')
  async genTokenTochangePassword(@Req() req) {
    const user = await this.userService.findOneByEmail(req.body.email, true);
    const token = await this.tokensService.create(user);
    await this.mailingService.sendPasswordReset({
      email: user.email.email,
      name: user.person.name
    }, token.token);
  }
}
