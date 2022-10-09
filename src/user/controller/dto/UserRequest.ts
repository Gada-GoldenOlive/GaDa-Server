import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { FriendStatus } from '../../domain/Friend/FriendStatus';

export class CreateUserRequest {
    @ApiProperty()
    loginId: string;

    @ApiProperty()
    password: string;
    
    @ApiProperty()
    name: string;

    @ApiPropertyOptional()
    image?: string;
}

// NOTE: 회원가입 할 땐 목표 시간, 거리를 설정 안 하니까 안 넣었고 업데이트에만 넣었음
export class UpdateUserRequest {
    @ApiPropertyOptional()
    password?: string;

    @ApiPropertyOptional()
    name?: string;

    @ApiPropertyOptional()
    image?: string;

    @ApiPropertyOptional()
    goalDistance?: number;
    
    @ApiPropertyOptional()
    goalTime?: number;
}

export class CreateFriendRequest {
    @ApiProperty()
    friendLoginId: string;
}

export class UpdateFriendRequest {
    @ApiProperty()
    status: FriendStatus;
}

export class LoginRequest {
    @ApiProperty()
    loginId: string;

    @ApiProperty()
    password: string;
}
