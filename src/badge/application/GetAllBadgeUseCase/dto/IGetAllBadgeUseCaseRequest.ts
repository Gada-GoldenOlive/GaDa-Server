import { BadgeCategory } from '../../../domain/Badge/BadgeCategory';
import { BadgeCode } from '../../../domain/Badge/BadgeCode';

export interface IGetAllBadgeUseCaseRequest {
	category?: BadgeCategory;  // NOTE: 해당하는 카테고리의 배지들만 리턴
	code?: BadgeCode; // NOTE: 해당하는 소분류의 배지들만 리턴
}
