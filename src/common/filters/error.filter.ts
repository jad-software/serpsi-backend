import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Request, Response } from 'express';
import { LoggerService } from "../logger/logger.service";


@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) { }

  async catch(exception: unknown, host: ArgumentsHost) {
    const httpCtx = host.switchToHttp();
    const request = httpCtx.getRequest<Request>();
    const response = httpCtx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : (exception as any)?.message || 'Internal server error';

    const stack = exception instanceof Error ? exception.stack : undefined;

    const context = this.extractContextFromStack(stack);
    const body = this.sanitizeBody(request.body);

    const meta = {
      path: request.url,
      method: request.method,
      headers: this.sanitizeHeaders(request.headers),
      body: body,
      query: request.query,
      stack,
    };

    this.logger.error(message, context, meta);

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private extractContextFromStack(stack?: string): string {
    if (!stack) return 'UnknownContext';

    const lines = stack.split('\n');

    const relevantLine = lines.find(line =>
      line.includes('at ') &&
      !line.includes('AllExceptionsFilter') &&
      !line.includes('node_modules'),
    );

    if (!relevantLine) return 'App';

    const match = relevantLine.match(/at (\S+)/);
    return match?.[1] || 'App';
  }

  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') return body;

    const sanitized = JSON.parse(JSON.stringify(body));

    if ('password' in sanitized) {
      sanitized.password = '[FILTERED]';
    }

    return sanitized;
  }

  private sanitizeHeaders(headers: Record<string, any>): Record<string, any> {
    if (!headers || typeof headers !== 'object') return headers;

    const sanitized = { ...headers };

    if (sanitized.authorization) {
      sanitized.authorization = '[FILTERED]';
    }

    return sanitized;
  }

}