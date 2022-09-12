import { ApiProperty } from '@nestjs/swagger';

import { Point } from '../../domain/Walkway/WalkwayStartPoint';
import { WalkFinishStatus, WALK_FINISH_STATUS } from '../../domain/Walk/WalkFinishStatus';


export class PointDto implements Point {
    @ApiProperty()
    lat: number;

    @ApiProperty()
    lng: number;
}

export class WalkwayDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    address: string;

    @ApiProperty()
    distance: number;

    @ApiProperty()
    time: number;

    @ApiProperty()
    pinCount: number;

    @ApiProperty()
    averageStar: number;

    @ApiProperty({
        type: [PointDto],
    })
    path: PointDto[];

    @ApiProperty({
        type: PointDto,
    })
    startPoint: PointDto;

    @ApiProperty()
    image: string;

    @ApiProperty()
    creator: string;

    @ApiProperty()
    creatorId: string;
}

export class GetAllWalkwayResponse {
    @ApiProperty({
        type: [WalkwayDto],
    })
    walkways?: WalkwayDto[];
}

export class GetWalkwayResponse {
    @ApiProperty()
    walkway?: WalkwayDto;
}

export class WalkDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    distance: number;

    @ApiProperty()
    time: number

    @ApiProperty({
        enum: WalkFinishStatus
    })
    finishStatus: WALK_FINISH_STATUS;

    @ApiProperty()
    rate: number;

    @ApiProperty()
    title: string;

    @ApiProperty()
    image: string;

    @ApiProperty()
    walkwayId: string;

    @ApiProperty()
    userId: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

export class GetAllWalkResponse {
    @ApiProperty({
        type: [WalkDto],
    })
    walks?: WalkDto[];
}

export class GetWalkResponse {
    @ApiProperty()
    walk?: WalkDto;
}
