import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { UserDbService } from "../../database/services/user.db.service";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "jwtRefresh") {
  constructor(private userDbService: UserDbService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.API_SECRET,
      audience: "refresh",
    });
  }


  /**
   * Checks if provided refresh token is up to date with the corresponding one in the database
   * @param payload decoded token
   */
  async validate(payload: any) {
    let user = await this.userDbService.findUser({
      _id: payload.id
    });

    if (user == undefined) {
      throw "user_not_found";
    }

    let token_pair = user.tokens.find(x => x.client == payload.cli);

    if (token_pair == undefined) {
      throw "client_not_found";
    }

    if (token_pair.refreshToken.iat == payload.iat) {
      return { payload, user };
    } else {
      // TODO: Maybe logout on all devices? ==> Obvious sign for a compromise of user data
      throw "refresh_token_inactive";
    }

  }
}