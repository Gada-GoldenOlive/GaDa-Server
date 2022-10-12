import { User } from "../../../../user/domain/User/User";
import { Review } from "../../../domain/Review/Review";

export interface IGetAllLikeUseCaseRequest {
    user?: User;
    review?: Review;
}
