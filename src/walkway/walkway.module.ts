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
import { GetWalkwayUseCase } from './application/GetWalkwayUseCase/GetWalkwayUseCase';
import { GetAllPinUseCase } from '../pin/application/GetAllPinUseCase/GetAllPinUseCase';
import { PIN_REPOSITORY } from '../pin/infra/IPinRepository';
import { MysqlPinRepository } from '../pin/infra/mysql/MysqlPinRepository';
import { PinEntity } from '../pin/entity/Pin.entity';
import { GetAllReviewUseCase } from '../review/application/GetAllReviewUseCase/GetAllReviewUseCase';
import { REVIEW_REPOSITORY } from '../review/infra/IReviewRepository';
import { MysqlReviewRepository } from '../review/infra/mysql/MysqlReviewRepository';
import { ReviewEntity } from '../review/entity/Review.entity';
import { GetAllNearWalkwayUseCase } from './application/GetAllNearWalkwayUseCase/GetAllNaerWalkwayUseCase';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            WalkwayEntity,
            WalkEntity,
            PinEntity,
            ReviewEntity,
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
        GetWalkwayUseCase,
        GetAllPinUseCase,
        GetAllReviewUseCase,
        GetAllNearWalkwayUseCase,
        {
            provide: WALKWAY_REPOSITORY,
            useClass: MysqlWalkwayRepository
        },
        {
            provide: PIN_REPOSITORY,
            useClass: MysqlPinRepository
        },
        {
            provide: REVIEW_REPOSITORY,
            useClass: MysqlReviewRepository
        }
    ],
})

export class WalkwayModule {}
