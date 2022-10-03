import { User } from '../../../../user/domain/User/User';
import { Badge } from '../../../domain/Badge/Badge';
import { BADGE_STATUS } from '../../../domain/Badge/BadgeStatus';

export interface ICreateAchievesUseCaseRequest {
	status?: BADGE_STATUS;
	badges: Badge[];
	user: User;
}
