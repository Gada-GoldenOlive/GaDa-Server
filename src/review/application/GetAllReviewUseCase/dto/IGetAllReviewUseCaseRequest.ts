import { User } from '../../../../user/domain/User/User';
import { Walkway } from '../../../../walkway/domain/Walkway/Walkway';
import { Point } from '../../../../walkway/domain/Walkway/WalkwayEndPoint';
import { REVIEW_ORDER_OPTIONS } from '../../../infra/mysql/MysqlReviewRepository';

export interface IGetAllReviewUseCaseRequest {
    walkway?: Walkway;
    user?: User;
    reviewOrderOption?: REVIEW_ORDER_OPTIONS;
    lat?: number;
    lng?: number;
}
