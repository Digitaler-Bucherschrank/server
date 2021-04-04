import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Config } from "../config";

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwtAccess') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: Config.secret,
      audience: "access"
    }, /* function(payload: any, done: VerifiedCallback){
      console.log(done)
    } */);
  }


  async validate(payload: any) {
    return payload;
  }
}