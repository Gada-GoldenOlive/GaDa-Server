import { User } from "../../../../user/domain/User/User";
import { WalkFinishStatus } from '../../../domain/Walk/WalkFinishStatus';

export enum GET_ALL_WALK_OPTION {
    WALKWAY_INFO,
    USER_INFO,
}

export interface IGetAllWalkUseCaseRequest {
    user: User;
    finishStatus?: WalkFinishStatus;
}
