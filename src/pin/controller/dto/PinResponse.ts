import { ApiProperty } from '@nestjs/swagger';

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
    userId: string;
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
