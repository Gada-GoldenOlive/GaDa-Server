import _ from 'lodash';

import { ImageUrl } from '../../../../common/domain/Image/ImageUrl';
import { Badge } from '../../../domain/Badge/Badge';
import { BadgeTitle } from '../../../domain/Badge/BadgeTitle';
import { BadgeEntity } from '../../../entity/Badge.entity';

export class MysqlBadgeRepositoryMapper {
	static toDomain(entity: BadgeEntity): Badge {
		if(_.isNil(entity)) {
			return null;
		}

		const badge = Badge.create({
			title: BadgeTitle.create(entity.title).value,
			image: ImageUrl.create(entity.image).value,
			category: entity.category,
			status: entity.status,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt
		}, entity.id).value;

		return badge;
	}

	static toDomains(entities: BadgeEntity[]): Badge[] {
		return _.map(entities, this.toDomain);
	}

	static toEntity(badge: Badge): BadgeEntity {
		if (_.isNil(badge)) {
			return null;
		}

		const entity: BadgeEntity = {
			id: badge.id,
			title: badge.title.value,
			image: badge.image.value,
			category: badge.category,
			status: badge.status,
			createdAt: badge.createdAt,
			updatedAt: badge.updatedAt,
			achieves: undefined,
		};

		return entity;
	}

	static toEntities(badges: Badge[]): BadgeEntity[] {
		return _.map(badges, (badge) => this.toEntity(badge));
	}
}
