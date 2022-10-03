import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtAuthGuard } from '../auth/jwt-auth.gaurd';
import { CreateBadgeUseCase } from './application/CreateBadgeUseCase/CreateBadgeUseCase';
import { GetAllBadgeUseCase } from './application/GetAllBadgeUseCase/GetAllBadgeUseCase';
import { BadgeController } from './controller/BadgeController';
import { AchieveEntity } from './entity/Achieve.entity';
import { BadgeEntity } from './entity/Badge.entity';
import { BADGE_REPOSITORY } from './infra/IBadgeRepository';
import { MysqlBadgeRepository } from './infra/mysql/MysqlBadgeRepository';

@Module({
    imports: [
        TypeOrmModule.forFeature([ 
            BadgeEntity,
            AchieveEntity,
        ]),
    ],
    controllers: [ BadgeController ],
    providers: [
        CreateBadgeUseCase,
        GetAllBadgeUseCase,
        {
            provide: BADGE_REPOSITORY,
            useClass: MysqlBadgeRepository,
        },
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})

export class BadgeModule {}
