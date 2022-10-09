import { Inject } from '@nestjs/common';

import { UseCase } from '../../../common/application/UseCase';
import { ACHIEVE_REPOSITORY, IAchieveRepository } from '../../infra/IAchieveRepository';
import { IGetAchieveUseCaseRequest } from './dto/IGetAchieveUseCaseRequest';
import { IGetAchieveUseCaseResponse } from './dto/IGetAchieveUseCaseResponse';

export enum GetAchieveUseCaseCodes {
	SUCCESS = 'SUCCESS',
	FAILURE = 'FAILURE',
	NOT_EXIST_ACHIEVE = 'Corresponding achieve does not exist.'
}

export class GetAchieveUseCase implements UseCase<IGetAchieveUseCaseRequest, IGetAchieveUseCaseResponse> {
	constructor(
		@Inject(ACHIEVE_REPOSITORY)
		private readonly achieveRepository: IAchieveRepository,
	) {}

	async execute(request: IGetAchieveUseCaseRequest): Promise<IGetAchieveUseCaseResponse> {
		try {
			const achieve = await this.achieveRepository.getOne(request);

			if (!achieve) {
				return {
					code: GetAchieveUseCaseCodes.NOT_EXIST_ACHIEVE,
				};
			}

			return {
				code: GetAchieveUseCaseCodes.SUCCESS,
				achieve,
			};
		} catch {
			return {
				code: GetAchieveUseCaseCodes.FAILURE,
			};
		}
	}
}
