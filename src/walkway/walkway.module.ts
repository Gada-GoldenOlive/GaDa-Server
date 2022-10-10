import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WalkwayController } from './controller/WalkwayController';
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
import { GetAllWalkwayUseCase } from './application/GetAllWalkwayUseCase/GetAllWalkwayUseCase';
import { GetSeoulmapWalkwayUseCase } from './application/GetSeoulMapWalkwayUseCase/GetSeoulmapWalkwayUseCase';
import { CreateWalkUseCase } from './application/CreateWalkUseCase/CreateWalkUseCase';
import { GetUserUseCase } from '../user/application/GetUserUseCase/GetUserUseCase';
import { WALK_REPOSITORY } from './infra/IWalkRepository';
import { MysqlWalkRepository } from './infra/mysql/MysqlWalkRepository';
import { USER_REPOSITORY } from '../user/infra/IUserRepository';
import { MysqlUserRepository } from '../user/infra/mysql/MysqlUserRepository';
import { UserEntity } from '../user/entity/User.entity';
import { GetAllWalkUseCase } from './application/GetAllWalkUseCase/GetAllWalkUseCase';
import { GetWalkUseCase } from './application/GetWalkUseCase/GetWalkUseCase';
import { UpdateUserUseCase } from '../user/application/UpdateUserUseCase/UpdateUserUseCase';
import { GetAchieveUseCase } from '../badge/application/GetAchieveUseCase/GetAchieveUseCase';
import { UpdateAchieveUseCase } from '../badge/application/UpdateAchieveUseCase/UpdateAchieveUseCase';
import { ACHIEVE_REPOSITORY } from '../badge/infra/IAchieveRepository';
import { MysqlAchieveRepository } from '../badge/infra/mysql/MysqlAchieveRepository';
import { AchieveEntity } from '../badge/entity/Achieve.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            WalkwayEntity,
            WalkEntity,
            PinEntity,
            ReviewEntity,
            UserEntity,
            AchieveEntity,
        ])
    ],
    controllers: [ WalkwayController ],
    providers: [
        CreateSeoulmapWalkwaysUseCase,
        CreateWalkwayUseCase,
        GetSeoulmapWalkwayUseCase,
        GetWalkwayUseCase,
        GetAllWalkwayUseCase,
        {
            provide: WALKWAY_REPOSITORY,
            useClass: MysqlWalkwayRepository
        },
        GetAllPinUseCase,
        {
            provide: PIN_REPOSITORY,
            useClass: MysqlPinRepository
        },
        GetAllReviewUseCase,
        {
            provide: REVIEW_REPOSITORY,
            useClass: MysqlReviewRepository
        },
        CreateWalkUseCase,
        GetWalkUseCase,
        GetAllWalkUseCase,
        {
            provide: WALK_REPOSITORY,
            useClass: MysqlWalkRepository
        },
        UpdateUserUseCase,
        GetUserUseCase,
        {
            provide: USER_REPOSITORY,
            useClass: MysqlUserRepository
        },
        GetAchieveUseCase,
        UpdateAchieveUseCase,
        {
            provide: ACHIEVE_REPOSITORY,
            useClass: MysqlAchieveRepository,
        },
    ],
})

export class WalkwayModule {}
