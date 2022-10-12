import { User } from "../../../../user/domain/User/User";

export interface IGetFriendUseCaseRequest {
    user1: User;
    user2: User;
}
