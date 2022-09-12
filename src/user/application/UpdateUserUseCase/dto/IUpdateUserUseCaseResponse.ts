import { CoreResponse } from '../../../../common/application/dto/CoreResponse';
import { User } from '../../../domain/User/User';

export interface IUpdateUserUseCaseResponse extends CoreResponse {
	user?: User;
}