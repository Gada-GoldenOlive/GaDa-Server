import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtStrategy } from '../auth/jwt.strategy';
import { LocalStrategy } from '../auth/local.strategy';
import { GetAllPinUseCase } from '../pin/application/GetAllPinUseCase/GetAllPinUseCase';
import { PinEntity } from '../pin/entity/Pin.entity';
import { PIN_REPOSITORY } from '../pin/infra/IPinRepository';
import { MysqlPinRepository } from '../pin/infra/mysql/MysqlPinRepository';
import { CreateUserUseCase } from './application/CreateUserUseCase/CreateUserUseCase';
import { GetUserUseCase } from './application/GetUserUseCase/GetUserUseCase';
import { LoginUseCase } from './application/LoginUseCase/LoginUseCase';
import { UpdateUserUseCase } from './application/UpdateUserUseCase/UpdateUserUseCase';
import { UserController } from './controller/UserController';
import { FriendEntity } from './entity/Friend.entity';
import { RecordEntity } from './entity/Record.entity';
import { UserEntity } from './entity/User.entity';
import { USER_REPOSITORY } from './infra/IUserRepository';
import { MysqlUserRepository } from './infra/mysql/MysqlUserRepository';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserEntity,
            FriendEntity,
            PinEntity,
            RecordEntity,
        ]),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '60s' },
        }),
    ],
    controllers: [ UserController ],
    providers: [
        CreateUserUseCase,
        GetUserUseCase,
        LoginUseCase,
        UpdateUserUseCase,
        {
            provide: USER_REPOSITORY,
            useClass: MysqlUserRepository,
        },
        GetAllPinUseCase,
        {
            provide: PIN_REPOSITORY,
            useClass: MysqlPinRepository,
        },
        JwtService,
        LocalStrategy,
        JwtStrategy,
        ConfigService,
    ],
})

export class UserModule {}
