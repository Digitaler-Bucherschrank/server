import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Config } from "../config";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy,  'jwtRefresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: Config.secret,
      audience: "refresh"
    }, /* function(payload: any, done: VerifiedCallback){
      console.log(done)
    } */);
  }


  // TODO: Check if token is valid (over the database entry)
  async validate(payload: any) {
    return payload;
  }
}