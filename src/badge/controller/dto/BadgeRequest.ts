import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { BadgeStatus, BADGE_STATUS } from '../../domain/Badge/BadgeStatus';

export class CreateBadgeRequest {
	@ApiProperty()
	title: string;

	@ApiProperty()
	image: string;
}

export class UpdateBadgeReqeust {
	@ApiPropertyOptional()
	title?: string;

	@ApiPropertyOptional()
	image?: string;

	@ApiPropertyOptional({
		enum: BadgeStatus,
	})
	status?: BADGE_STATUS;
}
