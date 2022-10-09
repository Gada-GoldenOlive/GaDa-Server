import { CoreResponse } from '../../../../common/application/dto/CoreResponse';
import { Comment } from '../../../domain/Comment/Comment';

export interface IGetAllCommentUseCaseResponse extends CoreResponse {
    comments?: Comment[];
}
