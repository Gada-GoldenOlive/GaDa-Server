import { User } from '../../../../user/domain/User/User';
import { Badge } from '../../../domain/Badge/Badge';

export interface ICreateAchievesUseCaseRequest {
	badges: Badge[];
	user: User;
}
