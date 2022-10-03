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
				/**
				 * 두 가지 방법이 있는데
				 * 1. BadgeStatus에 'HIDDEN'을 추가해서 HIDDEN 배지라면 AchieveStatus도 HIDDEN으로 설정
				 * 2. HIDDEN인 배지를 다 적어두고, category='어쩌고', code='저쩌고'에 해당하는 badge인지 검사해서 그것들이라면 HIDDEN으로 설정
				 * 나는 일단 1번이 더 간편하다고 생각해서 1번으로 진행했는데 2번이 낫다면 바꾸겠슴당
				 */

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
