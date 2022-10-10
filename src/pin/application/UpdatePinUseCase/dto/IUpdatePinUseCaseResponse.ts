import { CoreResponse } from '../../../../common/application/dto/CoreResponse';
import { Pin } from '../../../domain/Pin/Pin';

export interface IUpdatePinUseCaseResponse extends CoreResponse {
	pin?: Pin;
}
