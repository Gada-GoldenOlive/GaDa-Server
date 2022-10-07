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

export interface GetOneAchieveOptions {
	category?: BadgeCategory;
	code?: BadgeCode;
	user?: User;
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
	async getOne(id: string): Promise<Achieve> {
		throw new Error('Method not implemented.');
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
		throw new Error('Method not implemented.');
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
