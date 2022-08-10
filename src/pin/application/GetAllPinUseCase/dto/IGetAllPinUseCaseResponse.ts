import { CoreResponse } from '../../../../common/application/dto/CoreResponse';
import { Pin } from '../../../domain/Pin';

export interface IGetAllPinUseCaseResponse extends CoreResponse {
    pins?: Pin[];
}