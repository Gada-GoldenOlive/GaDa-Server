import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewController } from './controller/ReviewController';

import { ReviewEntity } from './entity/Review.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
        ReviewEntity,
    ])
  ],
  controllers: [ ReviewController ],
  providers: [],
})

export class ReviewModule {}
