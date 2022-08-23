import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CommentDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    content: string;

    @ApiProperty()
    creator: string;

    @ApiProperty()
    creatorId: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

export class GetAllCommentResponse {
    @ApiProperty({
        type: [CommentDto],
    })
    comments?: CommentDto[];
}

export class GetCommentResponse {
    @ApiPropertyOptional()
    comment?: CommentDto;
}
