import { forwardRef, Module } from '@nestjs/common';
import { PsychologistsService } from './psychologists.service';
import { PsychologistsController } from './psychologists.controller';
import { psychologistProvider } from './providers/psychologists.providers';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '../users/users.module';
import { PersonsModule } from '../persons/persons.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { AgendasModule } from './agendas.module';
import { UnusualModule } from './unusual.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { TokensModule } from 'src/auth/tokens.module';

@Module({
  controllers: [PsychologistsController],
  exports: [PsychologistsService],
  imports: [
    DatabaseModule,
    UsersModule,
    PersonsModule,
    CloudinaryModule,
    forwardRef(() => AgendasModule),
    forwardRef(() => UnusualModule),
    NotificationsModule,
    TokensModule,
  ],
  providers: [...psychologistProvider, PsychologistsService],
})
export class PsychologistsModule {}
