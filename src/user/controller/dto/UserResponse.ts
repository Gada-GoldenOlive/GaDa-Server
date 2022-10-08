import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    loginId: string;
    
    @ApiPropertyOptional()
    image?: string;
    
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
    accessToken: string;

    @ApiProperty()
    refreshToken: string;
}

export class FriendDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    userId: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    loginId: string;

    @ApiProperty()
    image: string;

    @ApiProperty()
    distance: number;
}

export class GetAllFriendResponse {
    @ApiProperty({
        type: [FriendDto],
    })
    friends?: FriendDto[];

    @ApiPropertyOptional()
    is_exist_unread_request?: boolean;
}
