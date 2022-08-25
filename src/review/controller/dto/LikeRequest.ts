import { ApiProperty } from '@nestjs/swagger';

export class CreateLikeRequest {
    @ApiProperty()
    id: string;

    @ApiProperty()
    reviewId: string;
}
