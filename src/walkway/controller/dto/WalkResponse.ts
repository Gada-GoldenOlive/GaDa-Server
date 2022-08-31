import { ApiProperty } from '@nestjs/swagger';
import { WalkFinishStatus, WALK_FINISH_STATUS } from '../../domain/Walk/WalkFinishStatus';

export class WalkDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    time: number;

    @ApiProperty()
    distance: number;

    @ApiProperty({
        enum: WalkFinishStatus
    })
    finishStatus: WALK_FINISH_STATUS;
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
