import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
    @ApiProperty()
    id: string;
    
    @ApiProperty()
    name: string;

    @ApiProperty()
    pinCount: number;

    @ApiProperty()
    image: string;

    @ApiProperty()
    totalDistance: number;

    @ApiProperty()
    totalTime: number;
}

export class GetAllUserResponse {
    @ApiProperty({
        type: [UserDto],
    })
    users?: UserDto[];
}

export class GetUserResponse {
    @ApiProperty()
    user?: UserDto;
}
