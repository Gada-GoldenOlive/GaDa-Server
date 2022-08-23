import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateUserUseCase } from './application/CreateUserUseCase/CreateUserUseCase';
import { GetUserUseCase } from './application/GetUserUseCase/GetUserUseCase';
import { LoginUseCase } from './application/LoginUseCase/LoginUseCase';
import { FriendController } from './controller/FriendController';
import { UserController } from './controller/UserController';
import { FriendEntity } from './entity/Friend.entity';
import { UserEntity } from './entity/User.entity';
import { USER_REPOSITORY } from './infra/IUserRepository';
import { MysqlUserRepository } from './infra/mysql/MysqlUserRepository';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserEntity,
            FriendEntity,
        ])
    ],
    controllers: [
        UserController,
        FriendController,
    ],
    providers: [
        CreateUserUseCase,
        GetUserUseCase,
        LoginUseCase,
        {
            provide: USER_REPOSITORY,
            useClass: MysqlUserRepository,
        },
    ],
})

export class UserModule {}
