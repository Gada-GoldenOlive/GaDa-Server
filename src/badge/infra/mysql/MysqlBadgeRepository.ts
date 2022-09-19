import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Badge } from '../../domain/Badge/Badge';
import { BadgeEntity } from '../../entity/Badge.entity';
import { IBadgeRepository } from '../IBadgeRepository';
import { MysqlBadgeRepositoryMapper } from './mapper/MysqlBadgeRepositoryMapper';

export class MysqlBadgeRepository implements IBadgeRepository {
	constructor(
		@InjectRepository(BadgeEntity)
		private readonly badgeRepository: Repository<BadgeEntity>,
	) {}

	async save(badge: Badge): Promise<boolean> {
		await this.badgeRepository.save(
			MysqlBadgeRepositoryMapper.toEntity(badge),
		);

		return true;
	}
}
