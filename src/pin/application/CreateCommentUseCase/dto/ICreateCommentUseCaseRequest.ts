import { User } from "../../../../user/domain/User/User";
import { Pin } from "../../../domain/Pin/Pin";

export interface ICreateCommentUseCaseRequest {
    content: string;
    pin: Pin;
    user: User;
}
