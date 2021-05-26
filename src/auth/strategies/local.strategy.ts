import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { BadGatewayException, BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { Request } from "express";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      passReqToCallback: true
    });
  }

  async validate(req: Request): Promise<any> {
    const user = await this.authService.validateUser(<string>req.body.username, <string>req.body.password, <string>req.body.client_id);
    if (user == null) {
      throw new UnauthorizedException();
    } else if (typeof user == "string") {
      throw new BadRequestException(null, user);
    } else {
      return user;
    }
  }
}