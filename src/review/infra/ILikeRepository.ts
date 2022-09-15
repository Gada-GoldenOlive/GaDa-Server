import { User } from "../../user/domain/User/User";
import { Like } from "../domain/Like/Like";
import { Review } from "../domain/Review/Review";

export const LIKE_REPOSITORY = Symbol('LIKE_REPOSITORY');

export interface ILikeRepository {
    findOne(userId: User, reviewId: Review): Promise<Like>;
}
