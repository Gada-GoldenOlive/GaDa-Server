import _ from 'lodash';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../../../user/domain/User/User';
import { Achieve } from '../../domain/Achieve/Achieve';
import { Badge } from '../../domain/Badge/Badge';
import { AchieveEntity } from '../../entity/Achieve.entity';
import { IAchieveRepository } from '../IAchieveRepository';
import { MysqlAchieveRepositoryMapper } from './mapper/MysqlAchieveRepository.mapper';

export interface GetAllAchieveOptions {
	status?: string;
	badge?: Badge;
	user?: User;
}

export class MysqlAchieveRepository implements IAchieveRepository {
	constructor(
		@InjectRepository(AchieveEntity)
		private readonly achieveRepository: Repository<AchieveEntity>
	) {}

	async getOne(id: string): Promise<Achieve> {
		throw new Error('Method not implemented.');
	}

	async getAll(options: GetAllAchieveOptions): Promise<Achieve[]> {
		throw new Error('Method not implemented.');
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
