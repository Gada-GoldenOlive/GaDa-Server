import { User } from '../../../../user/domain/User/User';
import { BadgeCategory } from '../../../domain/Badge/BadgeCategory';
import { BadgeCode } from '../../../domain/Badge/BadgeCode';

export interface IGetAllAchieveUseCaseRequest {
	user?: User;
	badgeCategory?: BadgeCategory;
	code?: BadgeCode;
	// NOTE: 나중에 배지 리턴해주는 거 구현하면서 조금 수정될 수도 있음
}
