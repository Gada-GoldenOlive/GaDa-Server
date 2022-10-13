import { CoreResponse } from '../../../../common/application/dto/CoreResponse';
import { PaginationResponse } from '../../../../common/pagination/PaginationResponse';
import { Like } from '../../../domain/Like/Like';

export interface IGetAllLikeUseCaseResponse extends CoreResponse, PaginationResponse {
    likes?: Like[];
}
