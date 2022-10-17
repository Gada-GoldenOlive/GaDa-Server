import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { PointDto } from './WalkwayResponse';
import { WalkFinishStatus, WALK_FINISH_STATUS } from "../../domain/Walk/WalkFinishStatus";
import { WALKWAY_STATUS, WalkwayStatus } from "../../domain/Walkway/WalkwayStatus";

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

    @ApiProperty({
        enum: WalkwayStatus
    })
    status: WALKWAY_STATUS;
}

export class UpdateWalkwayRequest {
    @ApiPropertyOptional()
    title?: string;

    @ApiPropertyOptional()
    image?: string;

    @ApiProperty({
        enum: WalkwayStatus
    })
    status: WALKWAY_STATUS;
}

export class CreateWalkRequest {
    @ApiProperty()
    time: number;

    @ApiProperty()
    distance: number;

    @ApiProperty()
    pinCount: number;

    @ApiProperty({
        enum: WalkFinishStatus
    })
    finishStatus: WALK_FINISH_STATUS;

    @ApiProperty()
    walkwayId: string;
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
