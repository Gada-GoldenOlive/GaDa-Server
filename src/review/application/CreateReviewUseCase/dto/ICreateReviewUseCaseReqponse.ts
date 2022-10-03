import { CoreResponse } from '../../../../common/application/dto/CoreResponse';
import { Review } from '../../../domain/Review/Review';

export interface ICreateReviewUseCaseResponse extends CoreResponse {
    review?: Review;
}
