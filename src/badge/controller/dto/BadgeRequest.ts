import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { BadgeStatus, BADGE_STATUS } from '../../domain/Badge/BadgeStatus';
import { ACHIEVE_STATUS } from '../../domain/Achieve/AchieveStatus'
import { BadgeCategory, BADGE_CATEGORY } from '../../domain/Badge/BadgeCategory';

export class CreateBadgeRequest {
	@ApiProperty()
	title: string;

	@ApiProperty()
	image: string;

	@ApiProperty({
		enum: BadgeCategory,
	})
	category: string;
}

export class UpdateBadgeReqeust {
	@ApiPropertyOptional()
	title?: string;

	@ApiPropertyOptional()
	image?: string;

	@ApiPropertyOptional({
		enum: BadgeCategory,
	})
	badge?: BADGE_CATEGORY;

	@ApiPropertyOptional({
		enum: BadgeStatus,
	})
	status?: BADGE_STATUS;
}

export class CreateAchieveRequest {
	@ApiProperty()
	badgeId: string;

	@ApiProperty()
	userId: string;

	@ApiPropertyOptional()
	status?: ACHIEVE_STATUS;
}

export class UpdateAchieveRequest {
	@ApiPropertyOptional()
	status?: ACHIEVE_STATUS;
}
