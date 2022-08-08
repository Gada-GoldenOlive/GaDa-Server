import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePinRequest {
    @ApiProperty()
    title: string;

    @ApiPropertyOptional()
    content?: string;

    @ApiPropertyOptional()
    image?: string;
}

export class UpdatePinRequest {
    @ApiPropertyOptional()
    title?: string;

    @ApiPropertyOptional()
    content?: string;

    @ApiPropertyOptional()
    image?: string;
}
