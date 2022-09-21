import { Badge } from '../domain/Badge/Badge';

export const BADGE_REPOSITORY = Symbol('BADGE_REPOSITORY');

export interface IBadgeRepository {
	save(badge: Badge): Promise<boolean>;
}
