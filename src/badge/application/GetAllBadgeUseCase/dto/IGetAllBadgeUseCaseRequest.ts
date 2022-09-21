import { BadgeCategory } from '../../../domain/Badge/BadgeCategory';

export interface IGetAllBadgeUseCaseRequest {
	category?: BadgeCategory;  // NOTE: 해당하는 카테고리의 배지들만 리턴
}
