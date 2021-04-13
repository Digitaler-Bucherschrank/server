import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";


/**
 *  Representing Auth-Guard for {@link JwtAccessStrategy}
 */
@Injectable()
export class JwtAccessAuthGuard extends AuthGuard("jwtAccess") {
  handleRequest(err, user, info) {
    if ((err || !user ) && info) {
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
    } else if(err && !info){
      switch (err) {
        case "client_not_found": {
          throw new HttpException("client_not_found", HttpStatus.UNAUTHORIZED);
        }

        case "user_not_found": {
          throw new HttpException("user_not_found", HttpStatus.UNAUTHORIZED);
        }

        case "access_token_outdated": {
          throw new HttpException("access_token_outdated", HttpStatus.UNAUTHORIZED);
        }
      }
    }
    return user;
  }
}
