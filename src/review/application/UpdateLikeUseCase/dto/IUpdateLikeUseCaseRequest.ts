import { Like } from "../../../domain/Like/Like";
import { LIKE_STATUS } from "../../../domain/Like/LikeStatus";

export interface IUpdateLikeUseCaseRequest {
    like: Like;
    status: LIKE_STATUS,
}
