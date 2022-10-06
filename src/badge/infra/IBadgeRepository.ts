import { Badge } from '../domain/Badge/Badge';
import { GetAllBadgeOptions } from './mysql/MysqlBadgeRepository';

export const BADGE_REPOSITORY = Symbol('BADGE_REPOSITORY');

export interface IBadgeRepository {
	save(badge: Badge): Promise<boolean>;
	saveAll(badges: Badge[]): Promise<boolean>;
	getAll(options: GetAllBadgeOptions): Promise<Badge[]>;
}
