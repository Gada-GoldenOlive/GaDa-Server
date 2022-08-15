import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CommonResponse {
    @ApiProperty()
    code: number;
    
    @ApiProperty()
    responseMessage?: string;

    @ApiPropertyOptional()
    isValid?: boolean;
}
