import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { UseCase } from '../../../common/application/UseCase';
import { ImageUrl } from '../../../common/domain/Image/ImageUrl';
import { Badge } from '../../domain/Badge/Badge';
import { BADGE_CATEGORY } from '../../domain/Badge/BadgeCategory';
import { BADGE_CODE } from '../../domain/Badge/BadgeCode';
import { BADGE_STATUS } from '../../domain/Badge/BadgeStatus';
import { BadgeTitle } from '../../domain/Badge/BadgeTitle';
import { BADGE_REPOSITORY, IBadgeRepository } from '../../infra/IBadgeRepository';
import { ICreateAllBadgeUseCaseRequest } from './dto/ICreateAllBadgeUseCaseRequest';
import { ICreateAllBadgeUseCaseResponse } from './dto/ICreateAllBadgeUseCaseResponse';

export enum CreateAllBadgeUseCaseCodes {
	SUCCESS = 'SUCCESS',
	FAILURE = 'FAILURE',
}

export class CreateAllBadgeUseCase implements UseCase<ICreateAllBadgeUseCaseRequest, ICreateAllBadgeUseCaseResponse> {
	constructor(
		@Inject(BADGE_REPOSITORY)
		private readonly badgeRepository: IBadgeRepository,
	) {}

	async execute(request: ICreateAllBadgeUseCaseRequest): Promise<ICreateAllBadgeUseCaseResponse> {
		try {
			const badges: Badge[] = _.map(request.badges, (badge) => {
				return Badge.createNew({
					title: BadgeTitle.create(badge.title).value,
					image: ImageUrl.create(badge.image).value,
					category: badge.category as BADGE_CATEGORY,
					code: badge.code as BADGE_CODE,
					status: badge.status ? badge.status as BADGE_STATUS : null,
				}).value;
			});
			
			await this.badgeRepository.saveAll(badges);

			return {
				code: CreateAllBadgeUseCaseCodes.SUCCESS,
			};
		} catch {
			return {
				code: CreateAllBadgeUseCaseCodes.FAILURE,
			};
		}
	}
}
