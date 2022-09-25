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
import { CreateLikeUseCase } from './application/CreateLikeUseCase/CreateLikeUseCase';
import { GetAllLikeUseCase } from './application/GetAllLikeUseCase/IGetAllLikeUseCase';
import { GetAllReviewUseCase } from './application/GetAllReviewUseCase/GetAllReviewUseCase';
import { GetLikeUseCase } from './application/GetLikeUseCase/IGetLikeUseCase';
import { GetReviewUseCase } from './application/GetReviewUseCase/IGetReviewUseCase';
import { ReviewController } from './controller/ReviewController';
import { LikeEntity } from './entity/Like.entity';
import { ReviewEntity } from './entity/Review.entity';
import { LIKE_REPOSITORY } from './infra/ILikeRepository';
import { REVIEW_REPOSITORY } from './infra/IReviewRepository';
import { MysqlLikeRepository } from './infra/mysql/MysqlLikeRepository';
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
      GetLikeUseCase,
      {
        provide: LIKE_REPOSITORY,
        useClass: MysqlLikeRepository,
      },
      GetAllLikeUseCase,
      CreateLikeUseCase,
  ],
})

export class ReviewModule {}
