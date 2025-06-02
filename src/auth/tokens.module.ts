import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { DatabaseModule } from 'src/database/database.module';
import { tokenProvider } from './providers/tokens.provider';
import { TokensController } from './tokens.controller';
import { UsersModule } from 'src/users/users.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [DatabaseModule, UsersModule, NotificationsModule],
  providers: [TokensService, ...tokenProvider],
  controllers: [TokensController],
  exports: [TokensService],
})
export class TokensModule {}
