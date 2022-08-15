import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { VEHCILE_STATUS, Vehicle } from '../../domain/Review/Vehicle';

export class ReviewDto {
    @ApiProperty()
    id: string;
    
    @ApiProperty()
    title: string;

    @ApiProperty({
        enum: Vehicle,
    })
    vehicle: VEHCILE_STATUS;

    @ApiProperty()
    star: number;

    @ApiProperty()
    content: string;

    @ApiPropertyOptional()
    image?: string;

    @ApiProperty()
    userId: string;

    @ApiProperty()
    userName: string;

    @ApiProperty()
    walkwayId: string;

    @ApiProperty()
    walkwayTitle: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

export class GetAllReviewResponse {
    @ApiProperty({
        type: [ReviewDto],
    })
    reviews?: ReviewDto[];

    averageStar: number;
}

export class GetReviewResponse {
    @ApiProperty()
    review: ReviewDto;
}
