import { ApiProperty } from '@nestjs/swagger';

export class CommonResponse {
    @ApiProperty()
    code: number;
    
    @ApiProperty()
    responseMessage?: string;
}
