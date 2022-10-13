import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { CommonResponse } from '../../../common/controller/dto/CommonResponse';
import { PaginationDto } from '../../../common/pagination/PaginationResponse';
import { VEHCILE_STATUS, Vehicle } from '../../domain/Review/Vehicle';

export class ImageDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    url: string;
}

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

    @ApiProperty()
    userId: string;

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

export class FeedDto extends ReviewDto {
    @ApiProperty()
    time: number;

    @ApiProperty()
    distance: number;

    @ApiPropertyOptional()
    walkwayImage?: string;

    @ApiProperty()
    address: string;

    @ApiPropertyOptional({
        type: [ImageDto]
    })
    images?: ImageDto[];

    @ApiProperty()
    like: boolean;
}

export class GetAllReviewResponse extends PaginationDto {
    @ApiProperty({
        type: [ReviewDto],
    })
    reviews?: ReviewDto[];

    averageStar: number;
}

export class GetFeedResponse extends CommonResponse {
    @ApiProperty()
    feed: FeedDto;
}

export class GetAllFeedResponse extends PaginationDto {
    @ApiProperty({
        type: [FeedDto],
    })
    feeds?: FeedDto[];
}

export class CreatePreSignedUrlResponse {
    @ApiProperty()
    url: string;
}
