import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { logger } from 'src/logger';

@Catch(BadRequestException)
export class CustomerBadRequestExceptionFilter
  implements ExceptionFilter<BadRequestException>
{
  public catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const respError = exception.getResponse() as any;
    let message = {};
    if (respError.message && Array.isArray(respError.message)) {
      respError.message.forEach((item: string) => {
        const split = item.split(':');
        message[split[0]] = split[1] || split[0];
      });
    } else {
      message = respError.message;
    }
    const request = ctx.getRequest();
    const errorMessage = `
      Exception: ${exception.stack}
      Status Code: ${status}
      Request URL: ${request.url}
      Body: ${JSON.stringify(request.body)}
    `;
    logger.error(errorMessage);
    response.status(status).json({
      statusCode: exception.getStatus(),
      error: exception.message,
      message,
    });
  }
}
