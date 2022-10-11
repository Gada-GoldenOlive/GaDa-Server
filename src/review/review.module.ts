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
import { GetWalkUseCase } from '../walkway/application/GetWalkUseCase/GetWalkUseCase';
import { CreateAllReviewImageUseCase } from './application/CreateAllReviewImageUseCase/CreateAllReviewImageUseCase';
import { WALK_REPOSITORY } from '../walkway/infra/IWalkRepository';
import { MysqlWalkRepository } from '../walkway/infra/mysql/MysqlWalkRepository';
import { WalkEntity } from '../walkway/entity/Walk.entity';
import { CreateReviewUseCase } from './application/CreateReviewUseCase/CreateReviewUseCase';
import { ImageController } from '../common/controller/ImageController';
import { DeleteLikeUseCase } from './application/DeleteLikeUseCase/DeleteLikeUseCase';
import { UpdateLikeUseCase } from './application/UpdateLikeUseCase/UpdateLikeUseCase';


@Module({
  imports: [
    TypeOrmModule.forFeature([
        ReviewEntity,
        UserEntity,
        WalkwayEntity,
        LikeEntity,
        ReviewImageEntity,
        WalkEntity,
    ])
  ],
  controllers: [ ReviewController, ImageController ],
  providers: [
      GetAllReviewUseCase,
      GetReviewUseCase,
      CreateReviewUseCase,
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
      DeleteLikeUseCase,
      UpdateLikeUseCase,
      {
        provide: LIKE_REPOSITORY,
        useClass: MysqlLikeRepository,
      },
      GetAllReviewImageUseCase,
      CreateAllReviewImageUseCase,
      {
        provide: REVIEW_IMAGE_REPOSITORY,
        useClass: MysqlReviewImageRepository,
      },
      GetWalkUseCase,
      {
        provide: WALK_REPOSITORY,
        useClass: MysqlWalkRepository,
      },
  ],
})

export class ReviewModule {}
