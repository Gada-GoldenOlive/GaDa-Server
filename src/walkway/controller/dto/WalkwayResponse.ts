import { ApiProperty } from "@nestjs/swagger";
import { LineString } from "geojson";

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
    path: LineString;

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
