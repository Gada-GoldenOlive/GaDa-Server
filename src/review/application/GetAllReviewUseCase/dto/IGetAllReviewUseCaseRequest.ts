import { PaginationRequest } from '../../../../common/pagination/PaginationRequest';
import { User } from '../../../../user/domain/User/User';
import { Walkway } from '../../../../walkway/domain/Walkway/Walkway';
import { REVIEW_ORDER_OPTIONS } from '../../../infra/mysql/MysqlReviewRepository';

export interface IGetAllReviewUseCaseRequest extends PaginationRequest {
    walkway?: Walkway;
    user?: User;
    reviewOrderOption?: REVIEW_ORDER_OPTIONS;
    lat?: number;
    lng?: number;
}
