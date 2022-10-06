import { User } from "../../../../user/domain/User/User";

export interface ICreateFriendUseCaseRequest {
    user: User;
    friend: User;
}
