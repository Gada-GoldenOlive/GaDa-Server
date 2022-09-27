import { CoreResponse } from '../../../../common/application/dto/CoreResponse';
import { Image } from '../../../../common/domain/Image/Image';

export interface IGetAllReviewImageUseCaseResponse extends CoreResponse {
	images?: Image[];
}
