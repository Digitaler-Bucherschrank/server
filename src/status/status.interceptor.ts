import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from "@nestjs/common";
import { Observable } from 'rxjs';
import * as path from "path";
import * as fs from "fs";
import { Config } from "../config";

@Injectable()
export class StatusInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Check if server is in maintenance mode
    // ==> 2 Modes: "maintenance" and "normal"
    let file = fs.readFileSync(path.join(Config.working_dir, './assets/maintenance.json'), 'utf8');
    let maintenance = JSON.parse(file);

    // TODO: Return approximate time for maintenance
    if (maintenance.status === "maintenance") {
      throw new HttpException('maintenance_mode', HttpStatus.SERVICE_UNAVAILABLE)
    } else {
      return next.handle();
    }
  }
}