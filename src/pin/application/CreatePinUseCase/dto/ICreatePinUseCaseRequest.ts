import { User } from '../../../../user/domain/User/User';
import { Walkway } from '../../../../walkway/domain/Walkway/Walkway';
import { Point } from '../../../domain/Pin/PinLocation';

export interface ICreatePinUseCaseRequest {
	title: string;
	content?: string;
	image?: string;
	location: Point;
	walkway: Walkway;
	user: User;
}
