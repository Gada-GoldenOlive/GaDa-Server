import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface JwtPayload {
    sub: string;
    username: string;
    refreshToken?: string;
}

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) {}

    getToken(payload: JwtPayload) {
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: '2h',
            secret: process.env.JWT_SECRET,
        });

        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: '7d',
            secret: process.env.JWT_SECRET,
        });

        return { accessToken, refreshToken };
    }
}

