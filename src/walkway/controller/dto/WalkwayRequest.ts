import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LineString } from 'geojson';

export class CreateWalkwayRequest {
    @ApiProperty()
    title: string;

    @ApiProperty()
    address: string;

    @ApiProperty()
    distance: number;

    @ApiProperty()
    time: number;

    @ApiProperty()
    path: LineString;

    @ApiProperty()
    creator: string;
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

    @ApiPropertyOptional()
    path?: LineString;

    @ApiPropertyOptional()
    creator?: string;
}

