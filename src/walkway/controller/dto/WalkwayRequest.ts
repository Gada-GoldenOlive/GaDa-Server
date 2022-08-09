import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { PointDto } from './WalkwayResponse';

export class CreateWalkwayRequest {
    @ApiProperty()
    title: string;

    @ApiProperty()
    address: string;

    @ApiProperty()
    distance: number;

    @ApiProperty()
    time: number;

    @ApiProperty({
        type: [PointDto],
    })
    path: PointDto[];
}

export class UpdateWalkwayRequest {
    @ApiProperty()
    id: string;

    @ApiPropertyOptional()
    title?: string;

    @ApiPropertyOptional()
    address?: string;

    @ApiPropertyOptional()
    distance?: number;

    @ApiPropertyOptional()
    time?: number;

    @ApiPropertyOptional({
        type: [PointDto],
    })
    path?: PointDto[];
}
