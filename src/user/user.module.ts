import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetAllPinUseCase } from '../pin/application/GetAllPinUseCase/GetAllPinUseCase';
import { PinEntity } from '../pin/entity/Pin.entity';
import { PIN_REPOSITORY } from '../pin/infra/IPinRepository';
import { MysqlPinRepository } from '../pin/infra/mysql/MysqlPinRepository';

import { CreateUserUseCase } from './application/CreateUserUseCase/CreateUserUseCase';
import { GetUserUseCase } from './application/GetUserUseCase/GetUserUseCase';
import { LoginUseCase } from './application/LoginUseCase/LoginUseCase';
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
        ])
    ],
    controllers: [ UserController ],
    providers: [
        CreateUserUseCase,
        GetUserUseCase,
        LoginUseCase,
        {
            provide: USER_REPOSITORY,
            useClass: MysqlUserRepository,
        },
        GetAllPinUseCase,
        {
            provide: PIN_REPOSITORY,
            useClass: MysqlPinRepository,
        },
    ],
})

export class UserModule {}
