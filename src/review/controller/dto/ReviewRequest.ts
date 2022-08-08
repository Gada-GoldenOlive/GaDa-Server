import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VEHCILE_STATUS } from '../../domain/Review/Vehicle';

export class CreateReviewRequest {
    @ApiProperty()
    title: string;

    @ApiProperty()
    vehicle: VEHCILE_STATUS;

    @ApiProperty()
    star: number;

    @ApiProperty()
    content: string;

    @ApiPropertyOptional()
    image?: string;

    @ApiProperty()
    userId: string; // NOTE: 어떤 유저가 쓴 리뷰인지

    @ApiProperty()
    walkwayId: string; // NOTE: 어떤 산책로의 리뷰인지
}

export class UpdateReviewRequest {
    @ApiProperty()
    title: string;

    @ApiProperty()
    vehicle: VEHCILE_STATUS;

    @ApiProperty()
    star: number;

    @ApiProperty()
    content: string;

    @ApiPropertyOptional()
    image?: string;
}
