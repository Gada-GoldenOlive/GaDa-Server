import { User } from '../../../../user/domain/User/User';
import { Point } from '../../../domain/Walkway/WalkwayStartPoint';
import { WALKWAY_STATUS } from "../../../domain/Walkway/WalkwayStatus";

export interface ICreateWalkwayUseCaseRequest {
    title: string;
    address: string;
    distance: number;
    time: number;
    path: Point[];
    image: string;
    user: User;
    status?: WALKWAY_STATUS;
}
