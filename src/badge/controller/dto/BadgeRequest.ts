import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { BadgeStatus, BADGE_STATUS } from '../../domain/Badge/BadgeStatus';
import { ACHIEVE_STATUS } from '../../domain/Achieve/AchieveStatus'
import { BadgeCategory, BADGE_CATEGORY } from '../../domain/Badge/BadgeCategory';
import { BadgeCode, BADGE_CODE } from '../../domain/Badge/BadgeCode';

export class CreateBadgeRequest {
	@ApiProperty()
	title: string;

	@ApiProperty()
	image: string;

	@ApiProperty({
		enum: BadgeCategory,
	})
	category: BADGE_CATEGORY;

	@ApiProperty({
		enum: BadgeCode,
	})
	code: BADGE_CODE;
}

export class UpdateBadgeReqeust {
	@ApiPropertyOptional()
	title?: string;

	@ApiPropertyOptional()
	image?: string;

	@ApiPropertyOptional({
		enum: BadgeCategory,
	})
	category?: BADGE_CATEGORY;

	@ApiPropertyOptional({
		enum: BadgeCode,
	})
	code?: BADGE_CODE;

	@ApiPropertyOptional({
		enum: BadgeStatus,
	})
	status?: BADGE_STATUS;
}

export class CreateAchieveRequest {
	@ApiProperty()
	badgeId: string;

	@ApiPropertyOptional()
	status?: ACHIEVE_STATUS;
}

export class UpdateAchieveRequest {
	@ApiPropertyOptional()
	status?: ACHIEVE_STATUS;
}
