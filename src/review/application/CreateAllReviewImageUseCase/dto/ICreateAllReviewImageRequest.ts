import { Review } from "../../../domain/Review/Review";

export interface ICreateAllReviewImageUseCaseRequest {
    review: Review;
    urls: string[];
}
