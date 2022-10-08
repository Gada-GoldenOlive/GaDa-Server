import { Inject } from '@nestjs/common';

import { UseCase } from '../../../common/application/UseCase';
import { Achieve } from '../../domain/Achieve/Achieve';
import { ACHIEVE_STATUS } from '../../domain/Achieve/AchieveStatus';
import { ACHIEVE_REPOSITORY, IAchieveRepository } from '../../infra/IAchieveRepository';
import { IUpdateAchieveUseCaseRequest } from './dto/IUpdateAchieveUseCaseRequest';
import { IUpdateAchieveUseCaseResponse } from './dto/IUpdateAchieveUseCaseResponse';

export enum UpdateAchieveUseCaseCodes {
	SUCCESS = 'SUCCESS',
	FAILURE = 'FAILURE',
	NOT_EXIST_ACHIEVE = 'Corresponding user does not exist.',
}

export class UpdateAchieveUseCase implements UseCase<IUpdateAchieveUseCaseRequest, IUpdateAchieveUseCaseResponse> {
	constructor(
		@Inject(ACHIEVE_REPOSITORY)
		private readonly achieveRepository: IAchieveRepository,
	) {}

	async execute(request: IUpdateAchieveUseCaseRequest): Promise<IUpdateAchieveUseCaseResponse> {
		try {
			const foundAchieve = await this.achieveRepository.getOne({
				id: request.id,
			});

			// NOTE: 업데이트 요청한 achieve가 존재하지 않는 경우
			if (!foundAchieve) {
				return {
					code: UpdateAchieveUseCaseCodes.NOT_EXIST_ACHIEVE,
				};
			}

			// NOTE: 나머지는 바뀔 게 없으니까 request로 들어왔든 말든 기존 걸로 해줌
			const achieve = Achieve.create({
				status: request.status as ACHIEVE_STATUS,
				createdAt: foundAchieve.createdAt,
				updatedAt: foundAchieve.updatedAt,
				badge: foundAchieve.badge,
				user: foundAchieve.user,
			}, foundAchieve.id).value;

			await this.achieveRepository.save(achieve);

			return {
				code: UpdateAchieveUseCaseCodes.SUCCESS,
			}; 
		} catch {
			return {
				code: UpdateAchieveUseCaseCodes.FAILURE,
			};
		}
	}
}