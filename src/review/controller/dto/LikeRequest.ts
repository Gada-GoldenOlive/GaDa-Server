import { ApiProperty } from '@nestjs/swagger';

export class CreateLikeRequest {
    @ApiProperty()
    userId: string;

    @ApiProperty()
    reviewId: string;
}
