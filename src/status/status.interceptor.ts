import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class StatusInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Check if server is in maintenance mode
    // ==> 2 Modes: "maintenance" and "normal"
    const file = fs.readFileSync(
      path.join(__dirname, '../../src/assets/maintenance.json'),
      'utf8',
    );
    const maintenance = JSON.parse(file);

    // TODO: Return approximate time for maintenance
    if (maintenance.status === 'maintenance') {
      throw new HttpException(
        'maintenance_mode',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    } else {
      return next.handle();
    }
  }
}
