import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GetUserUseCase } from '../user/application/GetUserUseCase/GetUserUseCase';
import { UserEntity } from '../user/entity/User.entity';
import { USER_REPOSITORY } from '../user/infra/IUserRepository';
import { MysqlUserRepository } from '../user/infra/mysql/MysqlUserRepository';
import { GetWalkwayUseCase } from '../walkway/application/GetWalkwayUseCase/GetWalkwayUseCase';
import { WalkwayEntity } from '../walkway/entity/Walkway.entity';
import { WALKWAY_REPOSITORY } from '../walkway/infra/IWalkwayRepository';
import { MysqlWalkwayRepository } from '../walkway/infra/mysql/MysqlWalkwayRepository';
import { GetAllReviewUseCase } from './application/GetAllReviewUseCase/GetAllReviewUseCase';
import { GetReviewUseCase } from './application/GetReviewUseCase/IGetReviewUseCase';
import { ReviewController } from './controller/ReviewController';
import { LikeEntity } from './entity/Like.entity';
import { ReviewEntity } from './entity/Review.entity';
import { REVIEW_REPOSITORY } from './infra/IReviewRepository';
import { MysqlReviewRepository } from './infra/mysql/MysqlReviewRepository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
        ReviewEntity,
        UserEntity,
        WalkwayEntity,
        LikeEntity,
    ])
  ],
  controllers: [ ReviewController ],
  providers: [
      GetAllReviewUseCase,
      {
          provide: REVIEW_REPOSITORY,
          useClass: MysqlReviewRepository,
      },
      GetUserUseCase,
      {
          provide: USER_REPOSITORY,
          useClass: MysqlUserRepository,
      },
      GetWalkwayUseCase,
      {
        provide: WALKWAY_REPOSITORY,
        useClass: MysqlWalkwayRepository,
      },
      GetReviewUseCase,
  ],
})

export class ReviewModule {}
