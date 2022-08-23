import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BadgeDto {
	@ApiProperty()
	id: string;

	@ApiProperty()
	title: string;
	
    @ApiProperty()
    image: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
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
