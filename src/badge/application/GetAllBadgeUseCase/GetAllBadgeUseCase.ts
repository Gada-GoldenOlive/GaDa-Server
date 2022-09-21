import { Inject } from '@nestjs/common';

import { UseCase } from '../../../common/application/UseCase';
import { BADGE_REPOSITORY, IBadgeRepository } from '../../infra/IBadgeRepository';
import { IGetAllBadgeUseCaseRequest } from './dto/IGetAllBadgeUseCaseRequest';
import { IGetAllBadgeUseCaseResponse } from './dto/IGetAllBadgeUseCaseResponse';

export enum GetAllBadgeUseCaseCodes {
	SUCCESS = 'SUCCESS',
	FAILURE = 'FAILURE',
}

export class GetAllBadgeUseCase implements UseCase<IGetAllBadgeUseCaseRequest, IGetAllBadgeUseCaseResponse> {
	constructor(
		@Inject(BADGE_REPOSITORY)
		private readonly badgeRepository: IBadgeRepository,
	) {}

	async execute(request: IGetAllBadgeUseCaseRequest): Promise<IGetAllBadgeUseCaseResponse> {
		try {
			const badges = await this.badgeRepository.getAll({
				category: request.category,
			});

			return {
				code: GetAllBadgeUseCaseCodes.SUCCESS,
				badges,
			};
		} catch {
			return {
				code: GetAllBadgeUseCaseCodes.FAILURE,
			};
		}
	}
}
