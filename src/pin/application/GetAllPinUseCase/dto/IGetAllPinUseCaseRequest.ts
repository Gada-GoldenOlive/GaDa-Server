import { User } from '../../../../user/domain/User';
import { Walkway } from '../../../../walkway/domain/Walkway/Walkway';

export interface IGetAllPinUseCaseRequest {
    walkway?: Walkway;
    user?: User;
}