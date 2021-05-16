import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UserDbService } from "../database/services/user.db.service";
import { JwtService } from "@nestjs/jwt";
import { User } from "../database/schemas/User";
import * as bcrypt from "bcrypt";
import { DocumentType } from "@typegoose/typegoose";

@Injectable()
export class AuthService {
  constructor(private userDBService: UserDbService, private jwtService: JwtService) {
  }

  /**
   * Checks for
   * 1. A corresponding user in the database
   * 2. An already existing logged in client
   *
   * In a case that one of these both fail, this function returns, instead of the user object, a error message
   * @param username
   * @param pass
   * @param client_id
   */
  async validateUser(username: string, pass: string, client_id: string): Promise<User | string> {
    const user = await this.userDBService.findUser({ username: username });
    if(user != null){
      if (!user.tokens?.some(e => e.client === client_id)) {
        return new Promise(function(fulfil, reject) {
          bcrypt.compare(pass, user.hash, function(err, result) {
            if (result == true) {
              user.client_id = client_id;
              fulfil(user);
            }
            reject(null);
          });
        });
      } else {
        return "client_id_already_used";
      }
    } else {
      return null;
    }
  }


  /* Users get a short-lived access token & long-lived refresh token, whereas both are linked to a client
  *  We basically are able to invalidate these when the user logouts and always check if the current tokens used are still valid
  */
  async login(user: User) {
    let tokens = {
      access_token: this.jwtService.sign({ id: user._id.toHexString(), cli: user.client_id }),
      refresh_token: this.jwtService.sign({ id: user._id.toHexString(), cli: user.client_id }, {
        expiresIn: "60d",
        audience: "refresh"
      })
    };

    let decrypted_at = <{ [key: string]: any }>this.jwtService.decode(tokens.access_token, {
      json: true,
      complete: false
    });

    let decrypted_rt = <{ [key: string]: any }>this.jwtService.decode(tokens.refresh_token, {
      json: true,
      complete: false
    });

    user.tokens.push({
      client: user.client_id, accessToken: {
        token: tokens.access_token,
        iat: decrypted_at.iat
      }, refreshToken: {
        token: tokens.refresh_token,
        iat: decrypted_rt.iat
      }
    });

    await (user as DocumentType<User>).save();
    return {
      id: user._id,
      username: user.username,
      tokens: {
        accessToken: {
          token: tokens.access_token,
          iat: decrypted_at.iat
        }, refreshToken: {
          token: tokens.refresh_token,
          iat: decrypted_rt.iat
        }
      }
    };
  }

  async refreshTokens(payload) {
    return {
      access_token: this.jwtService.sign({ id: payload.id, cli: payload.cli }),
      refresh_token: this.jwtService.sign({ id: payload.id, cli: payload.cli }, {
        expiresIn: "60d",
        audience: "refresh"
      })
    };
  }

  // TODO: Logout route ==> delete access/refresh token pair
  async logout(user) {
    let token_pair = user.tokens.find(x => x.client == user.client_id);

    if (token_pair != undefined) {
      user.tokens = user.tokens.filter(item => item !== token_pair);
      return await new Promise(function(fulfil, reject) {
        (user as DocumentType<User>).save(null, (err, res) => {
          if (err) {
            fulfil(false);
          } else {
            fulfil(true);
          }
        });
      });
    } else {
      throw new HttpException("client_already_logged_out", HttpStatus.BAD_REQUEST);
    }
  }
}
