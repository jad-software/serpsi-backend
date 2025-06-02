export class LoggerDto {
  level: 'info' | 'warn' | 'error';
  message: string;
  context: string;
  meta?: any;
}