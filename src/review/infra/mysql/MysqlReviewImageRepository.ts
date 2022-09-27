import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Image } from '../../../common/domain/Image/Image';
import { ReviewStatus } from '../../domain/Review/ReviewStatus';
import { ReviewImageEntity } from '../../entity/ReviewImage.entity';
import { IReviewImageRepository } from '../IReviewImageRepository';
import { WalkStatus } from '../../../walkway/domain/Walk/WalkStatus'
import { UserStatus } from '../../../user/domain/User/UserStatus';
import { MysqlReviewImageRepositoryMapper } from './mapper/MysqlReviewImageRepositoryMapper';

export interface GetAllReviewImageOptions {
    reviewIds?: string[];
	imageIds?: string[];
}

export class MysqlReviewImageRepository implements IReviewImageRepository {
	constructor(
		@InjectRepository(ReviewImageEntity)
		private readonly reviewImageRepository: Repository<ReviewImageEntity>,
	) {}

	async getAll(options: GetAllReviewImageOptions): Promise<Image[]> {
		const imageIds = options.imageIds;
		const reviewIds = options.reviewIds;

		const query = this.reviewImageRepository
		.createQueryBuilder('image')
		.leftJoinAndSelect('image.review', 'review')
		.leftJoinAndSelect('review.walk', 'walk')
		.leftJoinAndSelect('review.user', 'user')
		.where('review.status = :normal', { normal: ReviewStatus.NORMAL })
		.andWhere('walk.status = :normal', { normal: WalkStatus.NORMAL })
		.andWhere('user.status = :normal', { normal: UserStatus.NORMAL })

		if (imageIds) {
			query.andWhereInIds(imageIds);
		}

		if (reviewIds) {
			query.andWhere('reviewId IN (:reviewIds)', { reviewIds });
		}

		query.orderBy('image.createdAt', 'ASC');

		const images = await query.getMany();

		return MysqlReviewImageRepositoryMapper.toDomains(images);
	}
}