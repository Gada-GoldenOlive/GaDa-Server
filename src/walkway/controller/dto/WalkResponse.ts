import { ApiProperty } from "@nestjs/swagger";

export class WalkDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    walkTime: number;

    @ApiProperty()
    walkDistance: number;

    @ApiProperty()
    isFinished: boolean;
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