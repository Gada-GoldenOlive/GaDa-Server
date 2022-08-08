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
}

export class GetAllReviewResponse {
    @ApiProperty({
        type: [ReviewDto],
    })
    reviews?: ReviewDto[];

    AverageStar: number;
}

export class GetReviewResponse {
    @ApiProperty()
    review: ReviewDto;
}
