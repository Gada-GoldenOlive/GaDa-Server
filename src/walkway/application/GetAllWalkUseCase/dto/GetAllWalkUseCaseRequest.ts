import { User } from "../../../../user/domain/User/User";

export enum GET_ALL_WALK_OPTION {
    WALKWAY_INFO,
    USER_INFO,
}

export interface IGetAllWalkUseCaseRequest {
    user: User,
}
