import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AchieveDto } from '../../../badge/controller/dto/BadgeResponse';

export class CommonResponse {
    @ApiProperty()
    code: number;
    
    @ApiProperty()
    responseMessage?: string;

    @ApiPropertyOptional()
    isValid?: boolean;

    @ApiPropertyOptional()
    achieves?: AchieveDto[];
}
