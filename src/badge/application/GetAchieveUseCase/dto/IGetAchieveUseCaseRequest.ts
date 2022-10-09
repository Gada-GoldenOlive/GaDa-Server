import { User } from '../../../../user/domain/User/User';
import { ACHIEVE_STATUS } from '../../../domain/Achieve/AchieveStatus';
import { Badge } from '../../../domain/Badge/Badge';
import { BADGE_CATEGORY } from '../../../domain/Badge/BadgeCategory';
import { BADGE_CODE } from '../../../domain/Badge/BadgeCode';

export interface IGetAchieveUseCaseRequest {
	user: User;
	badge?: Badge;
	code?: BADGE_CODE;
	category?: BADGE_CATEGORY;
	status: ACHIEVE_STATUS;
}
