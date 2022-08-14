import { User } from '../../../../user/domain/User';
import { Walkway } from '../../../../walkway/domain/Walkway/Walkway';
import { Point } from '../../../domain/PinLocation';

export interface ICreatePinUseCaseRequest {
	title: string;
	content?: string;
	image?: string;
	location: Point;
	walkway: Walkway;
	user: User;
}
