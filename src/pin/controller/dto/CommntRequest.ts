import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommentRequest {
    @ApiProperty()
    content: string;

    @ApiProperty()
    pinId: string;

    @ApiProperty()
    userId: string;
}

export class UpdateCommentReqeust {
    @ApiProperty()
    commentId: string;

    @ApiPropertyOptional()
    content?: string;
}
