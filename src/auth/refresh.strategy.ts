import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as bcrypt from 'bcrypt';

import { User } from "../user/domain/User/User";
import { JwtPayload } from "./authServiece";

export async function checkRefreshToken(
    requestRefreshToken: string,
    user: User,
): Promise<boolean> {
    return await bcrypt.compare(requestRefreshToken, user.refreshToken.value);
}

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload) {
    const refreshToken = req.get('authorization').split('Bearer ')[1];

    return {
      ...payload,
      refreshToken,
    };
  }
}
