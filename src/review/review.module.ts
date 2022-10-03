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
import { GetAllReviewImageUseCase } from './application/GetAllReviewImageUseCase/GetAllReviewImageUseCase';
import { GetAllReviewUseCase } from './application/GetAllReviewUseCase/GetAllReviewUseCase';
import { GetLikeUseCase } from './application/GetLikeUseCase/IGetLikeUseCase';
import { GetReviewUseCase } from './application/GetReviewUseCase/IGetReviewUseCase';
import { ReviewController } from './controller/ReviewController';
import { LikeEntity } from './entity/Like.entity';
import { ReviewEntity } from './entity/Review.entity';
import { ReviewImageEntity } from './entity/ReviewImage.entity';
import { LIKE_REPOSITORY } from './infra/ILikeRepository';
import { REVIEW_IMAGE_REPOSITORY } from './infra/IReviewImageRepository';
import { REVIEW_REPOSITORY } from './infra/IReviewRepository';
import { MysqlLikeRepository } from './infra/mysql/MysqlLikeRepository';
import { MysqlReviewImageRepository } from './infra/mysql/MysqlReviewImageRepository';
import { MysqlReviewRepository } from './infra/mysql/MysqlReviewRepository';


@Module({
  imports: [
    TypeOrmModule.forFeature([
        ReviewEntity,
        UserEntity,
        WalkwayEntity,
        LikeEntity,
        ReviewImageEntity,
    ])
  ],
  controllers: [ ReviewController ],
  providers: [
      GetAllReviewUseCase,
      GetReviewUseCase,
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
      GetLikeUseCase,
      GetAllLikeUseCase,
      CreateLikeUseCase,
      {
        provide: LIKE_REPOSITORY,
        useClass: MysqlLikeRepository,
      },
      GetAllReviewImageUseCase,
      {
        provide: REVIEW_IMAGE_REPOSITORY,
        useClass: MysqlReviewImageRepository,
      },
  ],
})

export class ReviewModule {}
