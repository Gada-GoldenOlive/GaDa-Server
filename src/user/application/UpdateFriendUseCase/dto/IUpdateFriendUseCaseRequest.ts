import { FRIEND_STATUS } from "../../../domain/Friend/FriendStatus";

export interface IUpdateFriendUseCaseRequest {
    id: string;
    status: FRIEND_STATUS;
}
