import { User } from '../../../../user/domain/User/User';

export interface IGetAllCommentUseCaseRequest {
    user?: User;
    pinId?: string;
}
