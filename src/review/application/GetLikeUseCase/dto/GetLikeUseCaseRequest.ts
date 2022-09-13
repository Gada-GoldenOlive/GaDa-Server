import { User } from "../../../../user/domain/User/User";
import { Review } from "../../../domain/Review/Review";

export interface IGetLikeUseCaseRequest {
    user: User;
    review: Review;
}
