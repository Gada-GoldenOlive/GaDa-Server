import { ApiProperty } from '@nestjs/swagger';

export class CreateFriendRequest {
    @ApiProperty()
    user1Id: string;

    @ApiProperty()
    user2Id: string;
}
