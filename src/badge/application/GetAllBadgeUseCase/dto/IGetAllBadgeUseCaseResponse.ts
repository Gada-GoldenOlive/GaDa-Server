import { CoreResponse } from '../../../../common/application/dto/CoreResponse';
import { Badge } from '../../../domain/Badge/Badge';

export interface IGetAllBadgeUseCaseResponse extends CoreResponse {
	badges?: Badge[];
}
