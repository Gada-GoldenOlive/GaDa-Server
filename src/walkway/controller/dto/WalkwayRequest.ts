import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { PointDto } from './WalkwayResponse';
import { WalkFinishStatus, WALK_FINISH_STATUS } from "../../domain/Walk/WalkFinishStatus";

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

    @ApiPropertyOptional()
    image?: string;

    @ApiProperty()
    userId: string;
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

    @ApiPropertyOptional()
    image?: string;
}

export class CreateWalkRequest {
    @ApiProperty()
    time: number;

    @ApiProperty()
    distance: number;

    @ApiProperty({
        enum: WalkFinishStatus
    })
    finishStatus: WALK_FINISH_STATUS;

    @ApiProperty()
    walkwayId: string;

    @ApiProperty()
    userId: string;
}

export class UpdateWalkRequest {
    @ApiProperty()
    id: string;

    @ApiProperty()
    time?: number;

    @ApiProperty()
    distance?: number;

    @ApiProperty({
        enum: WalkFinishStatus
    })
    finishStatus: WALK_FINISH_STATUS;
}
