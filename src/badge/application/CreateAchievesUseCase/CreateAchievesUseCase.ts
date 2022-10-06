import _ from 'lodash';
import { Inject } from '@nestjs/common';

import { UseCase } from '../../../common/application/UseCase';
import { Achieve } from '../../domain/Achieve/Achieve';
import { AchieveStatus } from '../../domain/Achieve/AchieveStatus';
import { BadgeStatus } from '../../domain/Badge/BadgeStatus';
import { ACHIEVE_REPOSITORY, IAchieveRepository } from '../../infra/IAchieveRepository';
import { ICreateAchievesUseCaseRequest } from './dto/ICreateAchievesUseCaseRequest';
import { ICreateAchievesUseCaseResponse } from './dto/ICreateAchievesUseCaseResponse';

export enum CreateAchievesUseCaseCodes {
	SUCCESS = 'SUCCESS',
	FAILURE = 'FAILURE',
}

export class CreateAchievesUseCase implements UseCase<ICreateAchievesUseCaseRequest, ICreateAchievesUseCaseResponse> {
	constructor(
		@Inject(ACHIEVE_REPOSITORY)
		private readonly achieveRepository: IAchieveRepository,
	) {}

	async execute(request: ICreateAchievesUseCaseRequest): Promise<ICreateAchievesUseCaseResponse> {
		try {
			const achieves: Achieve[] = _.map(request.badges, (badge) => {

				if (badge.status === BadgeStatus.HIDDEN) {
					return Achieve.createNew({
						status: AchieveStatus.HIDDEN,
						badge,
						user: request.user,
					}).value;
				}

				return Achieve.createNew({
					badge,
					user: request.user,
				}).value;
			});

			await this.achieveRepository.saveAll(achieves);

			return {
				code: CreateAchievesUseCaseCodes.SUCCESS,
			};
		} catch {
			return {
				code: CreateAchievesUseCaseCodes.FAILURE,
			};
		};
	}
}
