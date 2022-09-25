import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StatusCodes } from 'http-status-codes';

import { GetUserUseCase, GetUserUseCaseCodes } from '../user/application/GetUserUseCase/GetUserUseCase';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configServiece: ConfigService,
    private readonly getUserUseCase: GetUserUseCase,
    ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configServiece.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const getUserUseCaseResponse = await this.getUserUseCase.execute({
        id: payload.sub,
    });

    if (getUserUseCaseResponse.code === GetUserUseCaseCodes.NO_EXIST_USER) {
        throw new HttpException(GetUserUseCaseCodes.NO_EXIST_USER, StatusCodes.NOT_FOUND);
    }

    if (getUserUseCaseResponse.code !== GetUserUseCaseCodes.SUCCESS) {
        throw new HttpException('FAIL TO GET USER', StatusCodes.INTERNAL_SERVER_ERROR);
    }

    return getUserUseCaseResponse.user;
  }
}
