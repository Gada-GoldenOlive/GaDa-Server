import { IPaginationOptions } from "nestjs-typeorm-paginate";

export interface PaginationRequest {
    paginationOptions?: IPaginationOptions;
}
