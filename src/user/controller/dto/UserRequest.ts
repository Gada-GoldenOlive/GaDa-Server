import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserRequest {
    @ApiProperty()
    name: string;

    @ApiPropertyOptional()
    image?: string;
}

export class UpdateUserRequest {
    @ApiProperty()
    id: string;

    @ApiPropertyOptional()
    name?: string;

    @ApiPropertyOptional()
    image?: string;
}
