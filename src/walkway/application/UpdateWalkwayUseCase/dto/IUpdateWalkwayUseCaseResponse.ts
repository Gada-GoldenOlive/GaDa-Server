import { CoreResponse } from '../../../../common/application/dto/CoreResponse';
import { Walkway } from '../../../domain/Walkway/Walkway';

export interface IUpdateWalkwayUseCaseResponse extends CoreResponse {
    walkway?: Walkway;
}
