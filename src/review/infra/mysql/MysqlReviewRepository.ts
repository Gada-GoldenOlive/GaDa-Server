import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../../user/domain/User/User';
import { UserStatus } from '../../../user/domain/User/UserStatus';
import { WalkStatus } from '../../../walkway/domain/Walk/WalkStatus';
import { Walkway } from '../../../walkway/domain/Walkway/Walkway';
import { Review } from '../../domain/Review/Review';
import { ReviewStatus } from '../../domain/Review/ReviewStatus';
import { ReviewEntity } from '../../entity/Review.entity';
import { IReviewRepository } from '../IReviewRepository';
import { MysqlReviewRepositoryMapper } from './mapper/MysqlReviewRepositoryMapper';

export interface GetAllReviewOptions {
    walkway?: Walkway;
    user?: User;
}

export class MysqlReviewRepository implements IReviewRepository {
    constructor(
        @InjectRepository(ReviewEntity)
        private readonly reviewRepository: Repository<ReviewEntity>,
    ) {}

    async getOne(id: string): Promise<Review> {
        const review = await this.reviewRepository.findOne({
            where: {
                id,
                status: ReviewStatus.NORMAL,
            },
            relations: [
                'walk',
                'walk.user',
                'walk.walkway'
            ],
        })

        return MysqlReviewRepositoryMapper.toDomain(review);
    }

    async save(review: Review): Promise<boolean> {
        await this.reviewRepository.save(
            MysqlReviewRepositoryMapper.toEntity(review),
        );

        return true;
    }

    async getAll(options: GetAllReviewOptions): Promise<Review[]> {
        const walkway = options.walkway;
        const user = options.user;

        const query = this.reviewRepository
        .createQueryBuilder('review')
        .leftJoinAndSelect('review.walk', 'walk')
        .leftJoinAndSelect('walk.user', 'user_walk')
        .leftJoinAndSelect('walk.walkway', 'walkway_walk')
        .where('review.status = :normal', { normal: ReviewStatus.NORMAL })

        if (walkway) query.andWhere('walkway_walk.id = :walkwayId', { walkwayId: walkway.id });
        if (user) query.andWhere('user_walk.id = :userId', { userId: user.id });

        query.orderBy('review.createdAt', 'DESC');
        const reviews = await query.getMany();

        return MysqlReviewRepositoryMapper.toDomains(reviews);
    }
}
