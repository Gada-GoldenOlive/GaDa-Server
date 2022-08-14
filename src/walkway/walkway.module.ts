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
import { GetSeoulmapWalkwayUseCase } from './application/GetSeoulMapWalkwayUseCase/GetSeoulmapWalkwayUseCase';
import { CreateWalkUseCase } from './application/CreateWalkUseCase/CreateWalkUseCase';
import { GetUserUseCase } from '../user/application/GetUserUseCase/GetUserUseCase';
import { WALK_REPOSITORY } from './infra/IWalkRepository';
import { MysqlWalkRepository } from './infra/mysql/MysqlWalkRepository';
import { USER_REPOSITORY } from '../user/infra/IUserRepository';
import { MysqlUserRepository } from '../user/infra/mysql/MysqlUserRepository';
import { UserEntity } from '../user/entity/User.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            WalkwayEntity,
            WalkEntity,
            PinEntity,
            ReviewEntity,
            UserEntity,
        ])
    ],
    controllers: [
        WalkwayController,
        WalkController
    ],
    providers: [
        CreateSeoulmapWalkwaysUseCase,
        CreateWalkwayUseCase,
        GetSeoulmapWalkwayUseCase,
        GetWalkwayUseCase,
        GetAllPinUseCase,
        GetAllReviewUseCase,
        GetAllNearWalkwayUseCase,
        CreateWalkUseCase,
        GetUserUseCase,
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
        },
        {
            provide: WALK_REPOSITORY,
            useClass: MysqlWalkRepository
        },
        {
            provide: USER_REPOSITORY,
            useClass: MysqlUserRepository
        }
    ],
})

export class WalkwayModule {}
