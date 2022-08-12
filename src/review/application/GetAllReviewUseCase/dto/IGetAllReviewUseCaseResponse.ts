import { CoreResponse } from '../../../../common/application/dto/CoreResponse';
import { Review } from '../../../domain/Review/Review';

export interface IGetAllReviewUseCaseResponse extends CoreResponse {
    reviews?: Review[];
    averageStar?: number;
}
