import { PaginationRequest } from "../../../../common/pagination/PaginationRequest";
import { User } from "../../../../user/domain/User/User";
import { Review } from "../../../domain/Review/Review";

export interface IGetAllLikeUseCaseRequest extends PaginationRequest {
    user?: User;
    review?: Review;
}
