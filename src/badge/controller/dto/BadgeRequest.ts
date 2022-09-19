import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { BadgeStatus, BADGE_STATUS } from '../../domain/Badge/BadgeStatus';
import { ACHIEVE_STATUS } from '../../domain/Achieve/AchieveStatus'

export class CreateBadgeRequest {
	@ApiProperty()
	title: string;

	@ApiProperty()
	image: string;

	@ApiProperty({
		enum: BadgeStatus,
	})
	category: string;
}

export class UpdateBadgeReqeust {
	@ApiPropertyOptional()
	title?: string;

	@ApiPropertyOptional()
	image?: string;

	@ApiPropertyOptional({
		enum: BadgeStatus,
	})
	badge?: string;

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
