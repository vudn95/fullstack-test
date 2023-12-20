import { logger } from 'src/logger';
import { ArgumentsHost, Catch, Injectable } from '@nestjs/common';
import { ExceptionFilter } from '@nestjs/common/interfaces/exceptions';

@Injectable()
@Catch()
export class ExceptionsLoggerFilter implements ExceptionFilter<any> {
  constructor() {}

  public async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.status || 500;
    let message = exception.message;
    const request = ctx.getRequest();
    const slackMessage = `
      Exception: ${exception.stack}
      Status Code: ${status}
      Request URL: ${request.url}
      Body: ${JSON.stringify(request.body)}
    `;
    logger.error(slackMessage);
    if (status === 500) {
      message = 'Internal Server Error';
    }
    response.status(status).json({
      statusCode: status,
      error: message,
    });
  }
}
