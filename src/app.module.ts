import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PersonsModule } from './persons/persons.module';
import { AddressesModule } from './addresses/addresses.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { PatientsModule } from './patients/patients.module';
import { DocumentsModule } from './documents/documents.module';
import { PsychologistsModule } from './psychologists/psychologists.module';
import { MeetingsModule } from './meetings/meetings.module';
import { BillsModule } from './bills/bills.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TokensModule } from './auth/tokens.module';
import { LoggerModule } from './common/logger/logger.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    UsersModule,
    AuthModule,
    PersonsModule,
    AddressesModule,
    CloudinaryModule,
    PatientsModule,
    DocumentsModule,
    PsychologistsModule,
    MeetingsModule,
    BillsModule,
    NotificationsModule,
    TokensModule,
    LoggerModule,
    EventEmitterModule.forRoot(),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'short',
          ttl: 1000,
          limit: 3,
        },
        {
          name: 'medium',
          ttl: 10000,
          limit: 20
        },
        {
          name: 'long',
          ttl: 60000,
          limit: 100
        }
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: "APP_GUARD",
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }
