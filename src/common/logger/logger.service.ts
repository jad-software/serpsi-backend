import { Inject, Injectable } from '@nestjs/common';
import chalk from 'chalk';
import { Repository } from 'typeorm';
import { LogEntity } from './entities/logger.entity';
import { OnEvent } from '@nestjs/event-emitter';
import { data_providers } from 'src/constants';
import { LoggerDto } from './dtos/logger.dto';

@Injectable()
export class LoggerService {
  constructor(
    @Inject(data_providers.LOGS_REPOSITORY)
    private readonly logRepo: Repository<LogEntity>,
  ) { }

  private readonly isProd = process.env.TEST_INTEGRATION === 'true';

  @OnEvent('log.info')
  async info(message: string, context = 'App', meta?: any) {
    if (!this.isProd) console.info(this.formatConsole({ level: 'info', message, context, meta }));
    await this.saveLog('info', message, context, meta);
  }

  @OnEvent('log.warn')
  async warn(message: string, context = 'App', meta?: any) {
    if (!this.isProd) console.warn(this.formatConsole({ level: 'warn', message, context, meta }));
    await this.saveLog('warn', message, context, meta);
  }

  @OnEvent('log.error')
  async error(message: string, context = 'App', meta?: any) {
    console.error(this.formatConsole({ level: 'error', message, context, meta }));
    await this.saveLog('error', message, context, meta);
  }

  private async saveLog(level: 'info' | 'warn' | 'error', message: string, context: string, meta?: any) {
    const log = this.logRepo.create({
      level,
      message,
      context,
      meta,
    });
    await this.logRepo.save(log);
  }

  private formatConsole({ level, context, message, meta }: LoggerDto) {
    const timestamp = new Date().toLocaleString('pt-BR');
    let filteredMeta = {};
    if (meta) {
      filteredMeta = {
        path: meta.path,
        method: meta.method,
        body: meta.body,
      };
    }

    let metaString = '';
    try {
      metaString = `${JSON.stringify(filteredMeta, null, ' ')}`;
    } catch {
      metaString = `[unserializable meta]`;
    }

    return `[${level.toUpperCase()}] [${timestamp}]  [${context}] - ${message}\n${metaString}`;
  }
}
