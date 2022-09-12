import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    userId: string;
    
    @ApiProperty()
    image: string;
    
    @ApiProperty()
    name: string;

    @ApiProperty()
    pinCount: number;

    @ApiPropertyOptional()
    badgeCount?: number;

    @ApiProperty()
    goalDistance: number;

    @ApiProperty()
    goalTime: number;

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
    @ApiPropertyOptional()
    user?: UserDto;
}

export class LoginOrSignUpUserResponse {
    @ApiProperty()
    id: string;
}
