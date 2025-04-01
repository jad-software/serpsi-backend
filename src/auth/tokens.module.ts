import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { DatabaseModule } from 'src/database/database.module';
import { tokenProvider } from './providers/tokens.provider';

@Module({
  imports: [DatabaseModule],
  providers: [TokensService, ...tokenProvider],
  controllers: [],
  exports: [TokensService],
})
export class TokensModule {}
