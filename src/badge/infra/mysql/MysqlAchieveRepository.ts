import _ from 'lodash';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../../../user/domain/User/User';
import { Achieve } from '../../domain/Achieve/Achieve';
import { AchieveEntity } from '../../entity/Achieve.entity';
import { IAchieveRepository } from '../IAchieveRepository';
import { MysqlAchieveRepositoryMapper } from './mapper/MysqlAchieveRepository.mapper';
import { BadgeCategory } from '../../domain/Badge/BadgeCategory';
import { BadgeCode } from '../../domain/Badge/BadgeCode';
import { AchieveStatus } from '../../domain/Achieve/AchieveStatus';
import { Badge } from '../../domain/Badge/Badge';

export interface GetOneAchieveOptions {
	id?: string;
	category?: BadgeCategory;
	code?: BadgeCode;
	user?: User;
	badge?: Badge;  // NOTE: 얘는 쓰일 일 없긴 한데 언제 필요한 일 있을지도 모르니까 넣어둠. 정석은 넣는 게 맞으니까,,
}

export interface GetAllAchieveOptions {
	user?: User;
}

export class MysqlAchieveRepository implements IAchieveRepository {
	constructor(
		@InjectRepository(AchieveEntity)
		private readonly achieveRepository: Repository<AchieveEntity>
	) {}

	// NOTE: 유저가 달성한 배지 리턴
	async getOne(options: GetOneAchieveOptions): Promise<Achieve> {
		const query = this.achieveRepository
		.createQueryBuilder('achieve')
		.leftJoinAndSelect('achieve.user', 'user')
		.leftJoinAndSelect('achieve.badge', 'badge')
		.where('(achieve.status = :non_achieve or achieve.status = :hidden)', { non_achieve: AchieveStatus.NON_ACHIEVE, hidden: AchieveStatus.HIDDEN });
		// NOTE: 이미 달성한 건 리턴해줄 필요 없으므로 고려 대상에서 제외

		if (options.id) query.andWhere('achieve.id = :achieveId', { achieve: options.id });
		if (options.user) query.andWhere('user.id = :userId', { userId: options.user.id });
		if (options.badge) query.andWhere('badge.id = :badgeId', { badgeId: options.badge.id });
		if (options.category) query.andWhere('badge.category = :category', { category: options.badge.category });
		if (options.code) query.andWhere('badge.code = :code', { code: options.badge.code });

		const achieve = await query.getOne();

		return MysqlAchieveRepositoryMapper.toDomain(achieve);
	}

	// NOTE: 유저가 가진 배지들 (삭제, 히든 제외) 리턴
	async getAll(options: GetAllAchieveOptions): Promise<Achieve[]> {
		const query = this.achieveRepository
		.createQueryBuilder('achieve')
		.leftJoinAndSelect('achieve.user', 'user')
		.leftJoinAndSelect('achieve.badge', 'badge')
		.where('(achieve.status = :non_achieve or achieve.status = :achieve)', { non_achieve: AchieveStatus.NON_ACHIEVE, achieve: AchieveStatus.ACHIEVE });

		if (options.user) query.andWhere('user.id = :userId', { userId: options.user.id });

		// NOTE: achieve 먼저 나열하고 이후 non-achieve
		query.orderBy('achieve.status', 'ASC')
		.addOrderBy('badge.category', 'DESC')
		.addOrderBy('badge.code', 'ASC');

		const achieves = await query.getMany();

		return MysqlAchieveRepositoryMapper.toDomains(achieves);
	}

	async save(achieve: Achieve): Promise<boolean> {
		await this.achieveRepository.save(
			MysqlAchieveRepositoryMapper.toEntity(achieve),
		);

		return true;
	}

	async saveAll(achieves: Achieve[]): Promise<boolean> {
		if (_.isEmpty(achieves)) {
			return false;
		}

		await this.achieveRepository
			.createQueryBuilder()
			.insert()
			.into('achieve')
			.values(MysqlAchieveRepositoryMapper.toEntities(achieves))
			.execute();
		
		return true;
	}
}
