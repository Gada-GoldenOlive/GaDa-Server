import { User } from "../../user/domain/User/User";
import { Like } from "../domain/Like/Like";
import { GetLikeOptions } from "./mysql/MysqlLikeRepository";

export const LIKE_REPOSITORY = Symbol('LIKE_REPOSITORY');

export interface ILikeRepository {
    findOne(options: GetLikeOptions): Promise<Like>;
    findAll(user: User): Promise<Like[]>;
    save(like: Like): Promise<Boolean>;
}
