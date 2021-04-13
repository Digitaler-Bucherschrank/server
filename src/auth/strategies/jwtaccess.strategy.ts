import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Config } from "../../config";
import { UserDbService } from "../../database/services/user.db.service";
import { mongoose } from "@typegoose/typegoose";

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, "jwtAccess") {
  constructor(private userDbService: UserDbService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: Config.secret,
      audience: "access"
    });
  }


  async validate(payload: any) {
    let user = await this.userDbService.findUser({
      _id: payload.id
    });

    if (user == undefined) {
      throw "user_not_found"
    }

    let token_pair = user.tokens.find(x => x.client == payload.cli);

    if (token_pair == undefined) {
      throw "client_not_found"
    }

    if (token_pair.refreshToken.iat == payload.iat) {
      user.client_id = token_pair.client
      return user;
    } else {
      throw "access_token_outdated"
    }

  }
}