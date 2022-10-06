import { CoreResponse } from '../../../../common/application/dto/CoreResponse';
import { Achieve } from '../../../domain/Achieve/Achieve';

export interface IGetAllAchieveUseCaseResponse extends CoreResponse {
	achieves?: Achieve[];
}
