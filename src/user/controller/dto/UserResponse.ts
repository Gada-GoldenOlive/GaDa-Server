import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CommonResponse } from '../../../common/controller/dto/CommonResponse';

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

    @ApiProperty()
    weekDistance: number;

    @ApiProperty()
    weekTime: number;
}

export class GetAllUserResponse extends CommonResponse {
    @ApiProperty({
        type: [UserDto],
    })
    users?: UserDto[];
}

export class GetUserResponse extends CommonResponse {
    @ApiPropertyOptional()
    user?: UserDto;
}

export class LoginOrSignUpUserResponse extends CommonResponse {
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
    image: string;

    @ApiProperty()
    distance: number;
}

export class GetAllFriendResponse extends CommonResponse {
    @ApiProperty({
        type: [FriendDto],
    })
    friends?: FriendDto[];

    @ApiProperty()
    is_exist_unread_request: boolean;
}

export class FriendRequestDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    userId: string;

    @ApiProperty()
    loginId: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    image: string;
}

export class GetAllFriendRequestResponse extends CommonResponse {
    @ApiProperty({
        type: [FriendRequestDto],
    })
    requests?: FriendRequestDto[];
}
