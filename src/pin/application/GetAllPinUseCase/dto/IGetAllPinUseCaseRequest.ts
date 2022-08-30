import { User } from '../../../../user/domain/User/User';
import { Walkway } from '../../../../walkway/domain/Walkway/Walkway';
import { Point } from '../../../domain/Pin/PinLocation';

export interface IGetAllPinUseCaseRequest {
    walkway?: Walkway;
    user?: User;
    curLocation?: Point;
}
