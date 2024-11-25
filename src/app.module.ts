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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
