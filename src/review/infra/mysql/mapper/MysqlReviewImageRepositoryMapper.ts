import _ from 'lodash';

import { Image } from '../../../../common/domain/Image/Image';
import { ImageUrl } from '../../../../common/domain/Image/ImageUrl';
import { ReviewImageEntity } from '../../../entity/ReviewImage.entity';
import { MysqlReviewRepositoryMapper } from './MysqlReviewRepositoryMapper';

export class MysqlReviewImageRepositoryMapper {
	static toDomain(entity: ReviewImageEntity): Image {
		if (_.isNil(entity)) {
			return null;
		}

		return Image.create({
			url: ImageUrl.create(entity.url).value,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
			review: entity.review ? MysqlReviewRepositoryMapper.toDomain(entity.review) : undefined,
		}, entity.id).value;
	}

	static toDomains(entities: ReviewImageEntity[]): Image[] {
		return _.map(entities, (entity) => MysqlReviewImageRepositoryMapper.toDomain(entity));
	}
}
