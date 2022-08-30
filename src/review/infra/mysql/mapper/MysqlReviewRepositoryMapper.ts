import _ from 'lodash';

import { ImageUrl } from '../../../../common/domain/Image/ImageUrl';
import { MysqlUserRepositoryMapper } from '../../../../user/infra/mysql/mapper/MysqlUserRepositoryMapper';
import { MysqlWalkwayRepositoryMapper } from '../../../../walkway/infra/mysql/mapper/MysqlWalkwayRepository.mapper';
import { Review } from '../../../domain/Review/Review';
import { ReviewContent } from '../../../domain/Review/ReviewContent';
import { ReviewStar } from '../../../domain/Review/ReviewStar';
import { ReviewTitle } from '../../../domain/Review/ReviewTitle';
import { ReviewEntity } from '../../../entity/Review.entity';

export class MysqlReviewRepositoryMapper {
    static toDomain(entity: ReviewEntity): Review {
        if (_.isNil(entity)) {
            return null;
        }

        return Review.create({
            title: ReviewTitle.create(entity.title).value,
            vehicle: entity.vehicle,
            star: ReviewStar.create(entity.star).value,
            content: ReviewContent.create(entity.content).value,
            image: entity.image ? ImageUrl.create(entity.image).value : null,
            status: entity.status,
            walkway: MysqlWalkwayRepositoryMapper.toDomain(entity.walkway),
            user: MysqlUserRepositoryMapper.toDomain(entity.user),
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        },
        entity.id).value;
    }

    static toDomains(entities: ReviewEntity[]): Review[] {
        return _.map(entities, (entity) => this.toDomain(entity));
    }

    static toEntity(review: Review): ReviewEntity {
        if (_.isNil(review)) {
            return null;
        }

        const entity: ReviewEntity = {
            id: review.id,
            title: review.title.value,
            vehicle: review.vehicle,
            star: review.star.value,
            content: review.content.value,
            image: review.image.value,
            status: review.status,
            walkway: MysqlWalkwayRepositoryMapper.toEntity(review.walkway),
            user: MysqlUserRepositoryMapper.toEntity(review.user),
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
            likes: undefined,
        }

        return entity;
    }

    static toEntities(reviews: Review[]): ReviewEntity[] {
        return _.map(reviews, (review) => this.toEntity(review));
    }
}
