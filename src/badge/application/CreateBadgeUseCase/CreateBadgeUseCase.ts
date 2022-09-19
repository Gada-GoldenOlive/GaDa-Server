import { Inject } from '@nestjs/common';

import { UseCase } from '../../../common/application/UseCase';
import { ImageUrl } from '../../../common/domain/Image/ImageUrl';
import { Badge } from '../../domain/Badge/Badge';
import { BADGE_CATEGORY } from '../../domain/Badge/BadgeCategory';
import { BadgeTitle } from '../../domain/Badge/BadgeTitle';
import { BADGE_REPOSITORY, IBadgeRepository } from '../../infra/IBadgeRepository';
import { ICreateBadgeUseCaseRequest } from './dto/ICreateBadgeUseCaseRequest';
import { ICreateBadgeUseCaseResponse } from './dto/ICreateBadgeUseCaseResponse';

export enum CreateBadgeUseCaseCodes {
	SUCCESS = 'SUCCESS',
	FAILURE = 'FAILURE',
}

export class CreateBadgeUseCase implements UseCase<ICreateBadgeUseCaseRequest, ICreateBadgeUseCaseResponse> {
	constructor(
		@Inject(BADGE_REPOSITORY)
		private readonly badgeRepository: IBadgeRepository,
	) {}

	async execute(request: ICreateBadgeUseCaseRequest): Promise<ICreateBadgeUseCaseResponse> {
		try {
			const badge = Badge.createNew({
				title: BadgeTitle.create(request.title).value,
				image: ImageUrl.create(request.image).value,
				category: request.category as BADGE_CATEGORY,
			}).value;

			await this.badgeRepository.save(badge);

			return {
				code: CreateBadgeUseCaseCodes.SUCCESS,
			};
		} catch {
			return {
				code: CreateBadgeUseCaseCodes.FAILURE,
			};
		}
	}
}
