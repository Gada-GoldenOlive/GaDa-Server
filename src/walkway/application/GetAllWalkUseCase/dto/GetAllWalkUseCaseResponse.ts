import { CoreResponse } from '../../../../common/application/dto/CoreResponse';
import { PaginationResponse } from '../../../../common/pagination/PaginationResponse';
import { Walk } from '../../../domain/Walk/Walk';

export interface IGetAllWalkUseCaseResponse extends CoreResponse, PaginationResponse {
    walks?: Walk[];
}
