import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Badge } from '../../domain/Badge/Badge';
import { BadgeCategory } from '../../domain/Badge/BadgeCategory';
import { BadgeStatus } from '../../domain/Badge/BadgeStatus';
import { BadgeEntity } from '../../entity/Badge.entity';
import { IBadgeRepository } from '../IBadgeRepository';
import { MysqlBadgeRepositoryMapper } from './mapper/MysqlBadgeRepositoryMapper';

export interface GetAllBadgeOptions {
	category?: BadgeCategory;
}

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

	async getAll(options: GetAllBadgeOptions): Promise<Badge[]> {
		const category = options.category;
		
		const query = this.badgeRepository
		.createQueryBuilder('badge')
		.where('badge.status = :normal', { normal: BadgeStatus.NORMAL })

		if (category) query.andWhere('badge.category = :category', { category });

		query.orderBy('badge.updatedAt', 'DESC'); // NOTE: 최신 업데이트순 정렬
		
		const badges = await query.getMany();

		return MysqlBadgeRepositoryMapper.toDomains(badges);

	}
}
