import { ApiProperty } from '@nestjs/swagger';
import { Point } from '../../domain/Pin/PinLocation';

export class LocationDto implements Point {
    @ApiProperty()
    lat: number;

    @ApiProperty()
    lng: number;
}

export class PinDto {
    @ApiProperty()
    id: string;
    
    @ApiProperty()
    title: string;

    @ApiProperty()
    content: string;

    @ApiProperty()
    image: string;

    @ApiProperty()
    location: LocationDto;

    @ApiProperty()
    walkwayId: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

export class GetAllPinResponse {
    @ApiProperty({
        type: [PinDto],
    })
    pins?: PinDto[];
}

export class GetPinResponse {
    @ApiProperty()
    pin?: PinDto;
}

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
    comments: CommentDto[];
}

export class GetCommentResponse {
    @ApiProperty()
    comment: CommentDto;
}
