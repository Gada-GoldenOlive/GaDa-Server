import { User } from '../../../../user/domain/User';
import { Walkway } from '../../../../walkway/domain/Walkway/Walkway';
import { Point } from '../../../domain/PinLocation';

export interface IGetAllPinUseCaseRequest {
    walkway?: Walkway;
    user?: User;
    curLocation?: Point;
}
