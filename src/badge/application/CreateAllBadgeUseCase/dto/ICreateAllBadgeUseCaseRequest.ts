import { ICreateBadgeUseCaseRequest } from '../../CreateBadgeUseCase/dto/ICreateBadgeUseCaseRequest';

export interface ICreateAllBadgeUseCaseRequest {
	badges: ICreateBadgeUseCaseRequest[];
}
