import { CoreResponse } from '../../../../common/application/dto/CoreResponse';
import { Like } from '../../../domain/Like/Like';

export interface IGetLikeUseCaseResponse extends CoreResponse {
    like?: Like;
}
