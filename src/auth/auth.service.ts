import { Injectable } from '@nestjs/common';
import { UserDbService } from "../database/services/user.db.service";
import { JwtService } from "@nestjs/jwt";
import { User } from "../database/entities/User";
import * as bcrypt from 'bcrypt';
import { ObjectId } from "@mikro-orm/mongodb";

@Injectable()
export class AuthService {
  constructor(private userDBService: UserDbService, private jwtService: JwtService){}
    async validateUser(username: string, pass: string, client_id: string): Promise<User | void> {
      const user = await this.userDBService.getUser({ username: username });
      if(!user.tokens?.some(e => e.client === client_id)){
        return new Promise(function(fulfil, reject) {
          bcrypt.compare(pass, user.hash, function(err, result) {
            if (result == true) {
              const { hash, ...result } = user;
              result.client_id = client_id
              fulfil(result);
            }
            reject(null)
          });
        })
      }
  }


  // TODO: Save tokens in the database
  /* Users get a short-lived access token & long-lived refresh token, whereas both are linked to a client
  *  We basically are able to invalidate these when the user logouts and always check if the current tokens used are still valid
  */
  async login(user: User) {
    return {
      access_token: this.jwtService.sign({ id: user._id.toHexString(), cli: user.client_id}),
      refresh_token: this.jwtService.sign({ id: user._id.toHexString(), cli: user.client_id}, {
        expiresIn: "60d",
        audience: "refresh"
      })
    };
  }

  // TODO: Replace tokens in the database after creating them
  async refreshTokens(user) {
    return {
      access_token: this.jwtService.sign({ id: user.id, cli: user.cli}),
      refresh_token: this.jwtService.sign({ id: user.id, cli: user.cli}, {
        expiresIn: "60d",
        audience: "refresh"
      })
    };
  }
}
