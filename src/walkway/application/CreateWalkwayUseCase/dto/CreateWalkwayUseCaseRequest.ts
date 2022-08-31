import { User } from '../../../../user/domain/User/User';
import { Point } from '../../../domain/Walkway/WalkwayStartPoint';

export interface ICreateWalkwayUseCaseRequest {
    title: string;
    address: string;
    distance: number;
    time: number;
    path: Point[];
    user: User;
}
