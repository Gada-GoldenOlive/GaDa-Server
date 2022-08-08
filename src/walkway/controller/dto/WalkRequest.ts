import { ApiProperty } from "@nestjs/swagger";
import { WalkFinishStatus, WALK_FINISH_STATUS } from "../../domain/Walk/WalkFinishStatus";

export class CreateWalkRequest {
    @ApiProperty()
    time: number;

    @ApiProperty()
    distance: number;

    @ApiProperty({
        enum: WalkFinishStatus
    })
    finishStatus: WALK_FINISH_STATUS;
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
