import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBadgeRequest {
    @ApiProperty()
    content: string;

    @ApiProperty()
    pinId: string;

    @ApiProperty()
    userId: string;
}

export class UpdateBadgeReqeust {
    @ApiPropertyOptional()
    content?: string;
}
