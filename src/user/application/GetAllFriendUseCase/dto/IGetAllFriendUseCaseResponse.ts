import { CoreResponse } from '../../../../common/application/dto/CoreResponse';
import { Friend } from '../../../domain/Friend/Friend';

export interface IGetAllFriendUseCaseResponse extends CoreResponse {
	friends?: Friend[];
}
