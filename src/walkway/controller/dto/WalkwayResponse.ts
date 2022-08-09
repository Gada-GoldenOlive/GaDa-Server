import { ApiProperty } from "@nestjs/swagger";
import { Point } from "../../domain/Walkway/WalkwayPath";

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

    @ApiProperty({
        type: [PointDto],
    })
    path: PointDto[];

    @ApiProperty()
    creator: string;

    @ApiProperty()
    creatorId: string;
}

export class GetAllNearWalkwayResponse {
    @ApiProperty({
        type: [WalkwayDto],
    })
    walkways?: WalkwayDto[];
}

export class GetWalkwayResponse {
    @ApiProperty()
    walkway?: WalkwayDto;
}
