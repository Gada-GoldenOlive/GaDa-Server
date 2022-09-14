import { CoreResponse } from '../../../../common/application/dto/CoreResponse';
import { Walk } from '../../../domain/Walk/Walk';

export interface IGetAllWalkUseCaseResponse extends CoreResponse {
    walks?: Walk[];
}
