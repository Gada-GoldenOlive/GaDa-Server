import _ from 'lodash';

import { ImageUrl } from '../../../../common/domain/Image/ImageUrl';
import { MysqlWalkRepositoryMapper } from '../../../../walkway/infra/mysql/mapper/MysqlWalkRepository.mapper';
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
            walk: MysqlWalkRepositoryMapper.toDomain(entity.walk),
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
            walk: MysqlWalkRepositoryMapper.toEntity(review.walk),
            likes: undefined,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
        }

        return entity;
    }

    static toEntities(reviews: Review[]): ReviewEntity[] {
        return _.map(reviews, (review) => this.toEntity(review));
    }
}
