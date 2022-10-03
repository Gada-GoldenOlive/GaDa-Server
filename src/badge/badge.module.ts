import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateAllBadgeUseCase } from './application/CreateBadgesUseCase/CreateAllBadgeUseCase';

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
        CreateAllBadgeUseCase,
        GetAllBadgeUseCase,
        {
            provide: BADGE_REPOSITORY,
            useClass: MysqlBadgeRepository,
        },
    ],
})

export class BadgeModule {}
