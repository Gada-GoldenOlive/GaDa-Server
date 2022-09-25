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

export class MysqlLikeRepository implements ILikeRepository {
    constructor(
        @InjectRepository(LikeEntity)
        private readonly likeRepository: Repository<LikeEntity>,
    ) {}

    async findOne(user: User, review: Review): Promise<Like> {
        const like = await this.likeRepository
        .createQueryBuilder('like')
        .leftJoinAndSelect('like.user', 'user')
        .leftJoinAndSelect('like.review', 'review')
        .where('review.status = :normal', { normal: ReviewStatus.NORMAL })
        .andWhere('user.status = :normal', { normal: UserStatus.NORMAL })
        .andWhere('like.status = :normal', { normal: LikeStatus.NORMAL })
        .andWhere('user.id = :userId', { userId: user.id })
        .andWhere('review.id = :reviewId', {reviewId: review.id })
        .getOne();

        return MysqlLikeRepositoryMapper.toDomain(like);
    }

    async findAll(user: User): Promise<Like[]> {
        const likes = await this.likeRepository
        .createQueryBuilder('like')
        .leftJoinAndSelect('like.user', 'user')
        .leftJoinAndSelect('like.review', 'review')
        .leftJoinAndSelect('review.walk', 'walk')
        .leftJoinAndSelect('walk.user', 'user_walk')
        .leftJoinAndSelect('walk.walkway', 'walkway_walk')
        .where('review.status = :normal', { normal: ReviewStatus.NORMAL })
        .andWhere('user.status = :normal', { normal: UserStatus.NORMAL })
        .andWhere('like.status = :normal', { normal: LikeStatus.NORMAL })
        .andWhere('user.id = :userId', { userId: user.id })
        .getMany();

        return MysqlLikeRepositoryMapper.toDomains(likes);
    }

    async save(like: Like): Promise<boolean> {
        await this.likeRepository.save(
            MysqlLikeRepositoryMapper.toEntity(like)
        );

        return true;
    }
}
