import { ApiProperty } from "@nestjs/swagger";
import { IPaginationLinks, IPaginationMeta } from "nestjs-typeorm-paginate";

export interface PaginationResponse {
    meta?: IPaginationMeta;
    links?: IPaginationLinks;
}

export class PaginationResult<T> {
    items: T[];
    meta?: IPaginationMeta;
    links?: IPaginationLinks;
}

class MetaDto {
    @ApiProperty({
        description: '해당 페이지의 item 개수',
    })
    itemCount: number;

    @ApiProperty({
        description: '전체 item 개수',
    })
    totalItems?: number;

    @ApiProperty({
        description: '페이지 크기 (페이지 당 item 개수)',
    })
    itemsPerPage: number;

    @ApiProperty({
        description: '총 페이지 수',
    })
    totalPages?: number;

    @ApiProperty({
        description: '현재 페이지 index (1부터 시작)',
    })
    currentPage: number;
}

class LinkDto {
    @ApiProperty({
        description: '첫 페이지 link (url)',
    })
     first?: string;

     @ApiProperty({
        description: '이전 페이지 link (url)',
    })
     previous?: string;

     @ApiProperty({
        description: '다음 페이지 link (url)',
    })
     next?: string;

     @ApiProperty({
        description: '마지막 페이지 link (url)',
    })
     last?: string;
}

export class PaginationDto {
    @ApiProperty()
    meta?: MetaDto;

    @ApiProperty({
        description: '해당 페이지가 존재하지 않으면 빈문자열("") 리턴'
    })
    links?: LinkDto;
}
