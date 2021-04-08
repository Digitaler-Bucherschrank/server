import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DatabaseModule } from "../database/database.module";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { Config } from "../config";
import { JwtAccessStrategy } from "./strategies/jwtaccess.strategy";
import { JwtRefreshStrategy } from "./strategies/jwtrefresh.strategy";

@Module({
  imports: [DatabaseModule, PassportModule,
    JwtModule.register({
      secret: Config.secret,
      // Expiry time for the Access Token ==> 12 hours
      signOptions: { expiresIn: '43200s', audience: 'access'},
    }),],
  providers: [AuthService, LocalStrategy, JwtAccessStrategy, JwtRefreshStrategy],
  exports: [AuthService]
})
export class AuthModule {}