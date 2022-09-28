import _ from 'lodash';
import { MysqlUserRepositoryMapper } from '../../../../user/infra/mysql/mapper/MysqlUserRepositoryMapper';
import { Achieve } from '../../../domain/Achieve/Achieve';
import { AchieveEntity } from '../../../entity/Achieve.entity';
import { MysqlBadgeRepositoryMapper } from './MysqlBadgeRepositoryMapper';

export class MysqlAchieveRepositoryMapper {
	static toDomain(entity: AchieveEntity): Achieve {
		if (_.isNil(entity)) {
			return null;
		}

		return Achieve.create({
			status: entity.status,
			badge: MysqlBadgeRepositoryMapper.toDomain(entity.badge),
			user: MysqlUserRepositoryMapper.toDomain(entity.user),
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		},
		entity.id).value;
	}

	static toDomains(entities: AchieveEntity[]): Achieve[] {
        return _.map(entities, (entity) => this.toDomain(entity));
    }

	static toEntity(achieve: Achieve): AchieveEntity {
		if (_.isNil(achieve)) {
			return null;
		}

		const entity = new AchieveEntity();
		entity.status = achieve.status;
		entity.badge = MysqlBadgeRepositoryMapper.toEntity(achieve.badge);
		entity.user = MysqlUserRepositoryMapper.toEntity(achieve.user);
		entity.createdAt = achieve.createdAt;
		entity.updatedAt = achieve.updatedAt;
	}

	static toEntities(achieves: Achieve[]): AchieveEntity[] {
        return _.map(achieves, (achieve) => this.toEntity(achieve));
    }
}