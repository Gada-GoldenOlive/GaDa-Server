import { ApiProperty } from '@nestjs/swagger';
import { Point } from '../../domain/PinLocation';

export class LocationDto implements Point {
    @ApiProperty()
    lat: number;

    @ApiProperty()
    lng: number;
}

export class PinDto {
    @ApiProperty()
    id: string;
    
    @ApiProperty()
    title: string;

    @ApiProperty()
    content: string;

    @ApiProperty()
    image: string;

    @ApiProperty()
    location: LocationDto;

    @ApiProperty()
    userId: string;

    @ApiProperty()
    walkwayId: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

export class GetAllPinResponse {
    @ApiProperty({
        type: [PinDto],
    })
    pins?: PinDto[];
}

export class GetPinResponse {
    @ApiProperty()
    pin?: PinDto;
}
