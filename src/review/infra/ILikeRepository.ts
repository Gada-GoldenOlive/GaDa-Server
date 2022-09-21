import { User } from "../../user/domain/User/User";
import { Like } from "../domain/Like/Like";
import { Review } from "../domain/Review/Review";

export const LIKE_REPOSITORY = Symbol('LIKE_REPOSITORY');

export interface ILikeRepository {
    findOne(user: User, review: Review): Promise<Like>;
    findAll(user: User): Promise<Like[]>;
    save(like: Like): Promise<Boolean>;
}
