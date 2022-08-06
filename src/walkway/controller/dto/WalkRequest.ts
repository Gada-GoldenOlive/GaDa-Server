import { ApiProperty } from "@nestjs/swagger";

export class CreateWalkRequest {
    @ApiProperty()
    walkTime: number;

    @ApiProperty()
    walkDistance: number;

    @ApiProperty()
    isFinished: boolean;
}

export class UpdateWalkRequest {
    @ApiProperty()
    id: string;

    @ApiProperty()
    walkTime?: number;

    @ApiProperty()
    walkDistance?: number;

    @ApiProperty()
    isFinished?: boolean;
}