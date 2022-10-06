import { Review } from "../../../domain/Review/Review";

export interface ICreateReviewImagesUseCaseRequest {
    review: Review;
    urls: string[];
}
