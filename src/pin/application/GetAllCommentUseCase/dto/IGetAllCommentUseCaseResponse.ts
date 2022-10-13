import { CoreResponse } from '../../../../common/application/dto/CoreResponse';
import { PaginationResponse } from '../../../../common/pagination/PaginationResponse';
import { Comment } from '../../../domain/Comment/Comment';

export interface IGetAllCommentUseCaseResponse extends CoreResponse, PaginationResponse {
    comments?: Comment[];
}
