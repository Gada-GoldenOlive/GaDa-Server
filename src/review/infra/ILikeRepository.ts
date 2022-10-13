import { PaginationResult } from "../../common/pagination/PaginationResponse";
import { Like } from "../domain/Like/Like";
import { GetAllLikeOptions, GetLikeOptions } from "./mysql/MysqlLikeRepository";

export const LIKE_REPOSITORY = Symbol('LIKE_REPOSITORY');

export interface ILikeRepository {
    findOne(options: GetLikeOptions): Promise<Like>;
    findAll(options: GetAllLikeOptions): Promise<PaginationResult<Like>>;
    save(like: Like): Promise<Boolean>;
}
