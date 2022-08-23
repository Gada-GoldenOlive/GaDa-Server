import { ApiProperty } from '@nestjs/swagger';

export class CreateFriendRequest {
    @ApiProperty()
    userId: string;

    @ApiProperty()
    friendId: string;
}
