import { ApiProperty } from '@nestjs/swagger';

import { Point } from '../../domain/Walkway/WalkwayStartPoint';
import { WalkFinishStatus, WALK_FINISH_STATUS } from '../../domain/Walk/WalkFinishStatus';
import { PaginationDto } from '../../../common/pagination/PaginationResponse';


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
    time: number;

    @ApiProperty({
        enum: WalkFinishStatus
    })
    finishStatus: WALK_FINISH_STATUS;

    @ApiProperty()
    title: string;

    @ApiProperty()
    image: string;

    @ApiProperty()
    createdAt: Date;
}

export class WalkListDto extends WalkDto {
    @ApiProperty()
    rate: number;
}

export class WalkDetailDto extends WalkDto {
    @ApiProperty()
    pinCount: number;

    @ApiProperty()
    walkwayId: string;
}

export class GetAllWalkResponse {
    @ApiProperty({
        type: [WalkListDto],
    })
    walks?: WalkListDto[];
}

export class GetAllWalkPaginationResponse extends PaginationDto {
    @ApiProperty({
        type: [WalkListDto],
    })
    walks?: WalkListDto[];
}

export class GetWalkResponse {
    @ApiProperty()
    walk?: WalkDetailDto;
}
