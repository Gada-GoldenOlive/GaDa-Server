import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserRequest {
    @ApiProperty()
    userId: string;

    @ApiPropertyOptional()
    password?: string;
    
    @ApiPropertyOptional()
    name?: string;

    @ApiPropertyOptional()
    image?: string;
}

export class UpdateUserRequest {
    @ApiPropertyOptional()
    userId?: string;

    @ApiPropertyOptional()
    name?: string;

    @ApiPropertyOptional()
    image?: string;
}

export class CreateFriendRequest {
    @ApiProperty()
    userId: string;

    @ApiProperty()
    friendLoginId: string;
}
