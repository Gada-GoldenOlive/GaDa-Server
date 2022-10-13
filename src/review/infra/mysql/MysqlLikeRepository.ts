import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "../../../user/domain/User/User";
import { UserStatus } from "../../../user/domain/User/UserStatus";
import { Like } from "../../domain/Like/Like";
import { LikeStatus } from "../../domain/Like/LikeStatus";
import { Review } from "../../domain/Review/Review";
import { ReviewStatus } from "../../domain/Review/ReviewStatus";
import { LikeEntity } from "../../entity/Like.entity";
import { ILikeRepository } from "../ILikeRepository";
import { MysqlLikeRepositoryMapper } from "./mapper/MysqlLikeRepositoryMapper";

export interface GetLikeOptions {
    user?: User;
    review?: Review;
    id?: string;
    is_include_delete?: boolean;
}

export interface GetAllLikeOptions {
    user?: User;
    review?: Review;
}

export class MysqlLikeRepository implements ILikeRepository {
    constructor(
        @InjectRepository(LikeEntity)
        private readonly likeRepository: Repository<LikeEntity>,
    ) {}

    async findOne(options: GetLikeOptions): Promise<Like> {
        const user = options.user;
        const review = options.review;
        const id = options.id;
        const is_include_delete = options.is_include_delete;

        const query = this.likeRepository
        .createQueryBuilder('like')
        .leftJoinAndSelect('like.user', 'user')
        .leftJoinAndSelect('like.review', 'review')
        .where('review.status = :normal', { normal: ReviewStatus.NORMAL })
        .andWhere('user.status = :normal', { normal: UserStatus.NORMAL });

        if (!id) {
            query.andWhere('user.id = :userId', { userId: user.id })
            .andWhere('review.id = :reviewId', {reviewId: review.id });

            if (!is_include_delete) {
                query.andWhere('like.status = :normal', { normal: LikeStatus.NORMAL });
            }
        }
        else {
            query.andWhere('like.id = :likeId', { likeId: id })
            .andWhere('like.status = :normal', { normal: LikeStatus.NORMAL });
        }

        const like = await query.getOne();

        return MysqlLikeRepositoryMapper.toDomain(like);
    }

    async findAll(options: GetAllLikeOptions): Promise<Like[]> {
        const user = options.user;
        const review = options.review;

        const query = await this.likeRepository
        .createQueryBuilder('like')
        .leftJoinAndSelect('like.user', 'user')
        .leftJoinAndSelect('like.review', 'review')
        .leftJoinAndSelect('review.walk', 'walk')
        .leftJoinAndSelect('walk.user', 'user_walk')
        .leftJoinAndSelect('walk.walkway', 'walkway_walk')
        .where('review.status = :normal', { normal: ReviewStatus.NORMAL })
        .andWhere('user.status = :normal', { normal: UserStatus.NORMAL })
        .andWhere('like.status = :normal', { normal: LikeStatus.NORMAL });

        if (user) {
            query.andWhere('user.id = :userId', { userId: user.id });
        }
        else if (review) {
            query.andWhere('review.id = :reviewId', { reviewId: review.id });
        }

        query.orderBy('like.createdAt', 'DESC');

        const likes = await query.getMany();

        return MysqlLikeRepositoryMapper.toDomains(likes);
    }

    async save(like: Like): Promise<boolean> {
        await this.likeRepository.save(
            MysqlLikeRepositoryMapper.toEntity(like)
        );

        return true;
    }
}
