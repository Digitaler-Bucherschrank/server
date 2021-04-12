import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";


/**
 *  Representing Auth-Guard for {@link JwtAccessStrategy}
 */
@Injectable()
export class JwtAccessAuthGuard extends AuthGuard("jwtAccess") {
  handleRequest(err, user, info) {
    if (err || !user) {
      switch (info.name) {
        case "TokenExpiredError": {
          throw new UnauthorizedException(null, "token_expired");
        }
        case "JsonWebTokenError": {
          throw new UnauthorizedException(null, "invalid_access_token");
        }

        default:
          throw err || new UnauthorizedException();
      }
    }
    return user;
  }
}
