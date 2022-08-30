import { CoreResponse } from '../../../../common/application/dto/CoreResponse';
import { Pin } from '../../../domain/Pin/Pin';

export interface IGetPinUseCaseResponse extends CoreResponse {
	pin?: Pin;
}
