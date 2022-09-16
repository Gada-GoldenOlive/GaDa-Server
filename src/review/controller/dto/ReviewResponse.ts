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
    userImage?: string;

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

export class FeedDto {
    @ApiProperty()
    review: ReviewDto;

    @ApiProperty()
    time: number;

    @ApiProperty()
    distance: number;

    @ApiPropertyOptional()
    walkwayImage?: string;

    @ApiProperty()
    address: string;

    @ApiPropertyOptional()
    images?: string[];
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

export class GetAllFeedReseponse {
    @ApiProperty({
        type: [FeedDto],
    })
    reviews?: FeedDto[];
}
