import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LocationDto } from './PinResponse';

export class CreatePinRequest {
    @ApiProperty()
    title: string;

    @ApiPropertyOptional()
    content?: string;

    @ApiPropertyOptional()
    image?: string;

    @ApiProperty()
    location: LocationDto;

    @ApiProperty()
    walkwayId: string;
}

export class UpdatePinRequest {
    @ApiPropertyOptional()
    title?: string;

    @ApiPropertyOptional()
    content?: string;

    @ApiPropertyOptional()
    image?: string;
}

export class CreateCommentRequest {
    @ApiProperty()
    content: string;

    @ApiProperty()
    pinId: string;
}

export class UpdateCommentReqeust {
    @ApiPropertyOptional()
    content?: string;
}
