import { CoreResponse } from '../../../../common/application/dto/CoreResponse';
import { PaginationResponse } from '../../../../common/pagination/PaginationResponse';
import { Review } from '../../../domain/Review/Review';

export interface IGetAllReviewUseCaseResponse extends CoreResponse, PaginationResponse {
    reviews?: Review[];
    averageStar?: number;
}
