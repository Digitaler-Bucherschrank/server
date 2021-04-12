import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Config } from "../../config";
import { UserDbService } from "../../database/services/user.db.service";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "jwtRefresh") {
  constructor(private userDbService: UserDbService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: Config.secret,
      audience: "refresh"
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

    let token_pair = user.tokens.find(x => x.client == payload.cli);
    if (token_pair.refreshToken.iat == payload.iat) {
      return payload;
    } else {
      throw new HttpException("refresh_token_outdated", HttpStatus.UNAUTHORIZED);
    }

  }
}