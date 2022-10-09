import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from '../auth/authServiece';
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
import { FRIEND_REPOSITORY } from './infra/IFriendRepository';
import { USER_REPOSITORY } from './infra/IUserRepository';
import { MysqlUserRepository } from './infra/mysql/MysqlUserRepository';
import {RefreshStrategy} from "../auth/refresh.strategy";
import { CreateFriendUseCase } from './application/CreateFriendUseCase/CreateFriendUseCase';
import { MysqlFriendRepository } from './infra/mysql/MysqlFriendRepository';
import { GetAllBadgeUseCase } from '../badge/application/GetAllBadgeUseCase/GetAllBadgeUseCase';
import { BADGE_REPOSITORY } from '../badge/infra/IBadgeRepository';
import { MysqlBadgeRepository } from '../badge/infra/mysql/MysqlBadgeRepository';
import { CreateAchievesUseCase } from '../badge/application/CreateAchievesUseCase/CreateAchievesUseCase';
import { ACHIEVE_REPOSITORY } from '../badge/infra/IAchieveRepository';
import { MysqlAchieveRepository } from '../badge/infra/mysql/MysqlAchieveRepository';
import { BadgeEntity } from '../badge/entity/Badge.entity';
import { AchieveEntity } from '../badge/entity/Achieve.entity';
import { UpdateFriendUseCase } from './application/UpdateFriendUseCase/UpdateFriendUseCase';
import { GetAllFriendUseCase } from './application/GetAllFriendUseCase/GetAllFriendUseCase';
import { DeleteFriendUseCase } from './application/DeleteFriendUseCase/DeleteFriendUseCase';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserEntity,
            PinEntity,
            FriendEntity,
            RecordEntity,
            BadgeEntity,
            AchieveEntity,
        ]),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
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
        RefreshStrategy,
        ConfigService,
        AuthService,
        CreateFriendUseCase,
        UpdateFriendUseCase,
        GetAllFriendUseCase,
        DeleteFriendUseCase,
        {
            provide: FRIEND_REPOSITORY,
            useClass: MysqlFriendRepository,
        },
        GetAllBadgeUseCase,
        {
            provide: BADGE_REPOSITORY,
            useClass: MysqlBadgeRepository,
        },
        CreateAchievesUseCase,
        {
            provide: ACHIEVE_REPOSITORY,
            useClass: MysqlAchieveRepository,
        },
    ],
})

export class UserModule {}
