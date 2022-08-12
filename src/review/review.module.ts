import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GetUserUseCase } from '../user/application/GetUserUseCase/GetUserUseCase';
import { UserEntity } from '../user/entity/User.entity';
import { USER_REPOSITORY } from '../user/infra/IUserRepository';
import { MysqlUserRepository } from '../user/infra/mysql/MysqlUserRepository';
import { GetAllReviewUseCase } from './application/GetAllReviewUseCase/GetAllReviewUseCase';
import { ReviewController } from './controller/ReviewController';
import { ReviewEntity } from './entity/Review.entity';
import { REVIEW_REPOSITORY } from './infra/IReviewRepository';
import { MysqlReviewRepository } from './infra/mysql/MysqlReviewRepository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
        ReviewEntity,
        UserEntity,
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
  ],
})

export class ReviewModule {}
