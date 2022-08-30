import { CoreResponse } from '../../../../common/application/dto/CoreResponse';
import { User } from '../../../domain/User/User';

export interface ILoginUseCaseResponse extends CoreResponse {
	user?: User;
}
