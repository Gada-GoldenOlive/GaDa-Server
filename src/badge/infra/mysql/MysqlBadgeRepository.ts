import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { Repository } from 'typeorm';

import { Badge } from '../../domain/Badge/Badge';
import { BadgeCategory } from '../../domain/Badge/BadgeCategory';
import { BadgeCode } from '../../domain/Badge/BadgeCode';
import { BadgeStatus } from '../../domain/Badge/BadgeStatus';
import { BadgeEntity } from '../../entity/Badge.entity';
import { IBadgeRepository } from '../IBadgeRepository';
import { MysqlBadgeRepositoryMapper } from './mapper/MysqlBadgeRepositoryMapper';

export interface GetAllBadgeOptions {
	category?: BadgeCategory;
	code?: BadgeCode;
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

	async saveAll(badges: Badge[]): Promise<boolean> {
		if (_.isEmpty(badges)) {
			return false;
		}

		await this.badgeRepository
		.createQueryBuilder()
		.insert()
		.into('badge')
		.values(MysqlBadgeRepositoryMapper.toEntities(badges))
		.execute();

		return true;
	}

	async getAll(options: GetAllBadgeOptions): Promise<Badge[]> {
		const category = options.category;
		const code = options.code;
		
		const query = this.badgeRepository
		.createQueryBuilder('badge')
		.where('badge.status = :normal or badge.status = :hidden', { normal: BadgeStatus.NORMAL, hidden: BadgeStatus.HIDDEN });

		if (category) query.andWhere('badge.category = :category', { category });
		if (code) query.andWhere('badge.code = :code', { code });

		query.orderBy('badge.updatedAt', 'DESC'); // NOTE: 최신 업데이트순 정렬
		
		const badges = await query.getMany();

		return MysqlBadgeRepositoryMapper.toDomains(badges);
	}
}
