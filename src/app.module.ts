import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
            type: 'postgres',
            url: process.env.POSTGRES_URL,
            autoLoadEntities: true,
            synchronize: true,
            migrations: [__dirname + '**/migrations/**/*{.ts,.js}'],
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
