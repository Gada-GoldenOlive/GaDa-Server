import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateAllBadgeUseCase } from './application/CreateAllBadgeUseCase/CreateAllBadgeUseCase';
import { CreateBadgeUseCase } from './application/CreateBadgeUseCase/CreateBadgeUseCase';
import { GetAllAchieveUseCase } from './application/GetAllAchieveUseCase/GetAllAchieveUseCase';
import { GetAllBadgeUseCase } from './application/GetAllBadgeUseCase/GetAllBadgeUseCase';
import { BadgeController } from './controller/BadgeController';
import { AchieveEntity } from './entity/Achieve.entity';
import { BadgeEntity } from './entity/Badge.entity';
import { ACHIEVE_REPOSITORY } from './infra/IAchieveRepository';
import { BADGE_REPOSITORY } from './infra/IBadgeRepository';
import { MysqlAchieveRepository } from './infra/mysql/MysqlAchieveRepository';
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
        GetAllAchieveUseCase,
        {
            provide: ACHIEVE_REPOSITORY,
            useClass: MysqlAchieveRepository,
        },
    ],
})

export class BadgeModule {}
