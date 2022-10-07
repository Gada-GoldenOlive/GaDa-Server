import { Inject } from '@nestjs/common';

import { UseCase } from '../../../common/application/UseCase';
import { ACHIEVE_REPOSITORY, IAchieveRepository } from '../../infra/IAchieveRepository';
import { IGetAllAchieveUseCaseRequest } from './dto/IGetAllAchieveUseCaseRequest';
import { IGetAllAchieveUseCaseResponse } from './dto/IGetAllAchieveUseCaseResponse';

export enum GetAllAchieveUseCaseCodes {
	SUCCESS = 'SUCCESS',
	FAILURE = 'FAILURE',
}

export class GetAllAchieveUseCase implements UseCase<IGetAllAchieveUseCaseRequest, IGetAllAchieveUseCaseResponse> {
	constructor(
		@Inject(ACHIEVE_REPOSITORY)
		private readonly achieveRepository: IAchieveRepository,
	) {}

	async execute(request: IGetAllAchieveUseCaseRequest): Promise<IGetAllAchieveUseCaseResponse> {
		try {			
			const achieves = await this.achieveRepository.getAll({
				user: request.user,
			});
			
			return {
				code: GetAllAchieveUseCaseCodes.SUCCESS,
				achieves,
			};
		} catch {
			return {
				code: GetAllAchieveUseCaseCodes.FAILURE,
			};
		}
	}
}
