import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WalkwayController } from './controller/WalkwayController';
import { WalkController } from './controller/WalkController';
import { WalkEntity } from './entity/Walk.entity';
import { WalkwayEntity } from './entity/Walkway.entity';
import { WALKWAY_REPOSITORY } from './infra/IWalkwayRepository';
import { CreateSeoulmapWalkwaysUseCase } from './application/CreateSeoulmapWalkwaysUseCase/CreateSeoulmapWalkwaysUseCase';
import { CreateWalkwayUseCase } from './application/CreateWalkwayUseCase/CreateWalkwayUseCase';
import { MysqlWalkwayRepository } from './infra/mysql/MysqlWalkwayRepository';
import { getSeoulmapWalkways } from './smartSeoulMap/getSeoulMapWalkways';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            WalkwayEntity,
            WalkEntity,
        ])
    ],
    controllers: [
        WalkwayController,
        WalkController
    ],
    providers: [
        CreateSeoulmapWalkwaysUseCase,
        CreateWalkwayUseCase,
        getSeoulmapWalkways,
        {
            provide: WALKWAY_REPOSITORY,
            useClass: MysqlWalkwayRepository
        }
    ],
})

export class WalkwayModule {}
