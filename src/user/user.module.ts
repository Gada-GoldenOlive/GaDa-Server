import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateUserUseCase } from './application/CreateUserUseCase/CreateUserUseCase';
import { UserController } from './controller/UserController';
import { UserEntity } from './entity/User.entity';
import { USER_REPOSITORY } from './infra/IUserRepository';
import { MysqlUserRepository } from './infra/mysql/MysqlUserRepository';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserEntity,
        ])
    ],
    controllers: [ UserController ],
    providers: [
        CreateUserUseCase,
        {
            provide: USER_REPOSITORY,
            useClass: MysqlUserRepository,
        },
    ],
})

export class UserModule {}
