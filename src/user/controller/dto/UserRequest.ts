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
    userId: string;  // TODO: 이거 uuid인지 loginId인지 확정지어야 함

    @ApiProperty()
    friendLoginId: string;
}
