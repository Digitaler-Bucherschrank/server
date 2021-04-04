import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from "express";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      passReqToCallback: true
    });
  }

   async validate(req: Request, username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password, <string>req.query.client_id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}