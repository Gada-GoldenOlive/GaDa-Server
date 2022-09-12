export enum GET_ALL_WALK_OPTION {
    WALKWAY_INFO,
    USER_INFO,
}

export interface IGetAllWalkUseCaseRequest {
    userId: string,
    option: number,
}
