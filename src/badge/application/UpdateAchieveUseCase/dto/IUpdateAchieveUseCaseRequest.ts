import { AchieveStatus } from '../../../domain/Achieve/AchieveStatus';

export interface IUpdateAchieveUseCaseRequest {
	id: string;
	status: AchieveStatus;
}
