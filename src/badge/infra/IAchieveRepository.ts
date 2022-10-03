import { Achieve } from '../domain/Achieve/Achieve';
import { GetAllAchieveOptions } from './mysql/MysqlAchieveRepository';

export const ACHIEVE_REPOSITORY = Symbol('ACHIEVE_REPOSITORY');

export interface IAchieveRepository {
	getOne(id: string): Promise<Achieve>;
	getAll(options: GetAllAchieveOptions): Promise<Achieve[]>;
	save(achieve: Achieve): Promise<boolean>;
	saveAll(achieves: Achieve[]): Promise<boolean>;
}
