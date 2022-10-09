import { CoreResponse } from '../../../../common/application/dto/CoreResponse';
import { Achieve } from '../../../domain/Achieve/Achieve';

export interface IGetAchieveUseCaseResponse extends CoreResponse {
	achieve?: Achieve;
}
