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
    images?: string[];

    @ApiProperty()
    walkId: string; // NOTE: 어떤 산책로의 리뷰인지
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
    images?: string[];
}
