import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BadgeDto {
	@ApiProperty()
	title: string;
	
    @ApiProperty()
    image: string;
}

export class AchieveDto {
	@ApiProperty()
	badge: BadgeDto;

	@ApiProperty()
	status: string;
}

export class GetAllBadgeResponse {
	@ApiProperty({
		type: [BadgeDto],
	})
	badges?: BadgeDto[];
}

export class GetBadgeResponse {
	@ApiPropertyOptional()
	badge?: BadgeDto;
}

export class GetAllAchieveResponse {
	@ApiProperty({
		type: [AchieveDto],
	})
	userBadges?: AchieveDto[];
}
