import { PaginationRequest } from '../../../../common/pagination/PaginationRequest';
import { User } from '../../../../user/domain/User/User';

export interface IGetAllCommentUseCaseRequest extends PaginationRequest {
    user?: User;
    pinId?: string;
}
