import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';

import { LoginUseCase, LoginUseCaseCodes } from '../user/application/LoginUseCase/LoginUseCase';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor( private loginUseCase: LoginUseCase ) {
    super({
        usernameField: 'loginId',
    });
  }

  async validate(loginId: string, password: string): Promise<any> {
    const loginUsecaseResponse = await this.loginUseCase.execute({
        loginId,
        password,
    })

    if (loginUsecaseResponse.code === LoginUseCaseCodes.WRONG_LOGIN_ID) {
        throw new HttpException(LoginUseCaseCodes.WRONG_LOGIN_ID, StatusCodes.NOT_FOUND);
    }

    if (loginUsecaseResponse.code === LoginUseCaseCodes.WRONG_PASSWORD) {
        throw new HttpException(LoginUseCaseCodes.WRONG_PASSWORD, StatusCodes.BAD_REQUEST);
    }

    if (loginUsecaseResponse.code === LoginUseCaseCodes.PROPS_VALUES_ARE_REQUIRED) {
        throw new HttpException(LoginUseCaseCodes.PROPS_VALUES_ARE_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    if (loginUsecaseResponse.code !== LoginUseCaseCodes.SUCCESS) {
        throw new HttpException('FAIL TO LOGIN', StatusCodes.INTERNAL_SERVER_ERROR);
    }

    if (!loginUsecaseResponse.user) {
        throw new UnauthorizedException();
    }

    return loginUsecaseResponse.user;
  }
}
