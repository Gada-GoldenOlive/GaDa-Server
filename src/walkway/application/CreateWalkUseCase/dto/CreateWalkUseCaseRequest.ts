import { User } from '../../../../user/domain/User/User';
import { WALK_FINISH_STATUS } from '../../../domain/Walk/WalkFinishStatus';
import { Walkway } from '../../../domain/Walkway/Walkway';

export interface ICreateWalkUseCaseRequest {
    time: number;
    distance: number;
    finishStatus: WALK_FINISH_STATUS
    walkway: Walkway
    user: User;
}
