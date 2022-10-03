import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserRequest {
    @ApiProperty()
    loginId: string;

    @ApiPropertyOptional()
    password?: string;
    
    @ApiPropertyOptional()
    name?: string;

    @ApiPropertyOptional()
    image?: string;
}

export class UpdateUserRequest {
    @ApiPropertyOptional()
    loginId?: string;

    @ApiPropertyOptional()
    password?: string;

    @ApiPropertyOptional()
    name?: string;

    @ApiPropertyOptional()
    image?: string;
}

export class CreateFriendRequest {
    @ApiProperty()
    friendLoginId: string;
}

export class LoginRequest {
    @ApiProperty()
    loginId: string;
    password: string;
}
