import { CoreResponse } from '../../../../common/application/dto/CoreResponse';
import { User } from '../../../domain/User';

export interface ICreateUserUseCaseResponse extends CoreResponse {
	user?: User;
}