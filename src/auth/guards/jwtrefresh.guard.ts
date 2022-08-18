import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';
import { UserDbService } from '../../database/services/user.db.service';
import { DocumentType } from '@typegoose/typegoose';
import { User } from '../../database/schemas/User';

/**
 *  Representing Auth-Guard for {@link JwtRefreshStrategy}
 */
@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwtRefresh') {
  constructor(private userDbService: UserDbService) {
    super();
  }

  handleRequest(err, user, info, context) {
    if ((err || !user) && info) {
      switch (info.name) {
        case 'TokenExpiredError': {
          const auth_token =
            context.args[0].headers.authorization.split(' ')[1];
          // No need to verify the token right here as the AuthGuard did that before hand
          const dec_token = <{ [p: string]: any }>jwt.decode(auth_token);

          this.userDbService
            .findUser({
              _id: dec_token.id,
            })
            .then((user) => {
              if (user != undefined) {
                const token_pair = user.tokens.find(
                  (x) => x.client == dec_token.cli,
                );

                if (token_pair != undefined) {
                  user.tokens = user.tokens.filter(
                    (item) => item !== token_pair,
                  );
                  (user as DocumentType<User>).save(null);
                }
              }
            });

          throw new UnauthorizedException(null, 'token_expired');
        }
        case 'JsonWebTokenError': {
          throw new UnauthorizedException(null, 'invalid_refresh_token');
        }

        default:
          throw err || new UnauthorizedException();
      }
    } else if (err && !info) {
      switch (err) {
        case 'client_not_found': {
          throw new HttpException('client_not_found', HttpStatus.UNAUTHORIZED);
        }

        case 'user_not_found': {
          throw new HttpException('user_not_found', HttpStatus.UNAUTHORIZED);
        }

        case 'refresh_token_inactive': {
          throw new HttpException(
            'refresh_token_inactive',
            HttpStatus.UNAUTHORIZED,
          );
        }
      }
    }
    return user;
  }
}
