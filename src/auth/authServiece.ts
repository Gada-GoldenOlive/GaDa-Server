import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StatusCodes } from 'http-status-codes';
import { UpdateUserUseCase, UpdateUserUseCaseCodes } from '../user/application/UpdateUserUseCase/UpdateUserUseCase';

export interface JwtPayload {
    sub: string;
    username: string;
    refreshToken?: string;
}

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private readonly updateUserUseCase: UpdateUserUseCase,
    ) {}

    async getToken(payload: JwtPayload) {
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: '2h',
            secret: process.env.JWT_SECRET,
        });

        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: '7d',
            secret: process.env.JWT_SECRET,
        });

        const updateUserUseCaseResponse = await this.updateUserUseCase.execute({
            id: payload.sub,
            refreshToken,
        });

        if (updateUserUseCaseResponse.code === UpdateUserUseCaseCodes.NO_EXIST_USER) {
            throw new HttpException(UpdateUserUseCaseCodes.NO_EXIST_USER, StatusCodes.NOT_FOUND);
        }

        if (updateUserUseCaseResponse.code == UpdateUserUseCaseCodes.DUPLICATE_USER_ID_ERROR) {
            throw new HttpException(UpdateUserUseCaseCodes.DUPLICATE_USER_ID_ERROR, StatusCodes.CONFLICT);
        }
        
        if (updateUserUseCaseResponse.code !== UpdateUserUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO UPDATE USER', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        return { accessToken, refreshToken };
    }
}

