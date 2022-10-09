import { ACHIEVE_STATUS } from '../../../domain/Achieve/AchieveStatus';

export interface IUpdateAchieveUseCaseRequest {
	id: string;
	status: ACHIEVE_STATUS;
}
