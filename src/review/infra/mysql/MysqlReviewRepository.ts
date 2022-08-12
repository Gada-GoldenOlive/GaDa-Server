import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../../user/domain/User';
import { UserStatus } from '../../../user/domain/UserStatus';
import { Walkway } from '../../../walkway/domain/Walkway/Walkway';
import { WalkwayStatus } from '../../../walkway/domain/Walkway/WalkwayStatus';
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

    getOne(id: string): Promise<Review> {
        throw new Error('Method not implemented.');
    }

    save(review: Review): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    async getAll(options: GetAllReviewOptions): Promise<Review[]> {
        const walkway = options.walkway;
        const user = options.user;

        const query = this.reviewRepository
        .createQueryBuilder('review')
        .where('review.status = :status', { status: ReviewStatus.NORMAL })
        .leftJoinAndSelect('review.walkway', 'walkway')
        .leftJoinAndSelect('review.user', 'user')
        .andWhere('walkway.status = :status', { status: WalkwayStatus.NORMAL })
        .andWhere('user.status = :status', { status: UserStatus.NORMAL });

        if (walkway) query.andWhere('walkway.id = :walkwayId', { walkwayId: walkway.id });
        if (user) query.andWhere('user.id = :userId', { userId: user.id });

        const reviews = await query.getMany();

        return MysqlReviewRepositoryMapper.toDomains(reviews);
    }
}
