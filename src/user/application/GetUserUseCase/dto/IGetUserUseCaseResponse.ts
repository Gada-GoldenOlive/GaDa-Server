import { CoreResponse } from '../../../../common/application/dto/CoreResponse';
import { User } from '../../../domain/User/User';

export interface IGetUserUseCaseResponse extends CoreResponse {
    user?: User;
}
