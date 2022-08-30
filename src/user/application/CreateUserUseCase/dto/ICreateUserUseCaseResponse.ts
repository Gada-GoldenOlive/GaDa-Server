import { CoreResponse } from '../../../../common/application/dto/CoreResponse';
import { User } from '../../../domain/User/User';

export interface ICreateUserUseCaseResponse extends CoreResponse {
	user?: User;
}
