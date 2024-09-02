import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guards';
import { JwtAuthGuard } from './guards/jwt.guards';
import { Public } from 'src/constants';
import { User } from './providers/user.decorator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDTO } from './dto/login.dto';
import { RolesGuard } from './guards/roles.guards';
import { Roles } from './providers/roles.decorator';
import { Role } from 'src/users/vo/role.enum';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
