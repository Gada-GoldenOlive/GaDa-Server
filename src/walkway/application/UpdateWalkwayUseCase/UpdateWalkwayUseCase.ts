import { Inject } from '@nestjs/common';

import { UseCase } from '../../../common/application/UseCase';
import { ImageUrl } from '../../../common/domain/Image/ImageUrl';
import { Walkway } from '../../domain/Walkway/Walkway';
import { WalkwayAddress } from '../../domain/Walkway/WalkwayAddress';
import { WalkwayDistance } from '../../domain/Walkway/WalkwayDistance';
import { WalkwayEndPoint } from '../../domain/Walkway/WalkwayEndPoint';
import { WalkwayPath } from '../../domain/Walkway/WalkwayPath';
import { WalkwayStartPoint } from '../../domain/Walkway/WalkwayStartPoint';
import { WalkwayTime } from '../../domain/Walkway/WalkwayTime';
import { WalkwayTitle } from '../../domain/Walkway/WalkwayTitle';
import { WALKWAY_REPOSITORY, IWalkwayRepository } from '../../infra/IWalkwayRepository';
import { IUpdateWalkwayUseCaseRequest } from './dto/IUpdateWalkwayUseCaseRequest';
import { IUpdateWalkwayUseCaseResponse } from './dto/IUpdateWalkwayUseCaseResponse';

export enum UpdateWalkwayUseCaseCodes {
	SUCCESS = 'SUCCESS',
	FAILURE = 'FAILURE',
	NOT_EXIST_WALKWAY = 'Corresponding walkway does not exist.',
}

export class UpdateWalkwayUseCase implements UseCase<IUpdateWalkwayUseCaseRequest, IUpdateWalkwayUseCaseResponse> {
	constructor(
		@Inject(WALKWAY_REPOSITORY)
		private readonly walkwayRepository: IWalkwayRepository,
	) {}

	async execute(request: IUpdateWalkwayUseCaseRequest): Promise<IUpdateWalkwayUseCaseResponse> {
		try {
			// NOTE: 업데이트 요청한 Walkway가 존재하지 않는 경우
			const foundWalkway = await this.walkwayRepository.findOne(request.id);

			if (!foundWalkway) {
				return {
					code: UpdateWalkwayUseCaseCodes.NOT_EXIST_WALKWAY,
				};
			}

			if (!request.title) request.title = foundWalkway.title.value;
			if (!request.image) request.image = foundWalkway.image ? foundWalkway.image.value : null;

			const walkway = Walkway.create({
                title: WalkwayTitle.create(request.title).value,
                address: WalkwayAddress.create(foundWalkway.address.value).value,
                distance: WalkwayDistance.create(foundWalkway.distance.value).value,
                time: WalkwayTime.create(foundWalkway.time.value).value,
                path: WalkwayPath.create(foundWalkway.path.value).value,
                startPoint: WalkwayStartPoint.create(foundWalkway.startPoint.value).value,
                endPoint: WalkwayEndPoint.create(foundWalkway.endPoint.value).value,
                user: foundWalkway.user,
                status: foundWalkway.status,
				image: request.image ? ImageUrl.create(request.image).value : null,
				createdAt: foundWalkway.createdAt,
				updatedAt: new Date(),
			}, request.id).value;
			
			await this.walkwayRepository.save(walkway);

			return {
				code: UpdateWalkwayUseCaseCodes.SUCCESS,
			};
		} catch {
			return {
				code: UpdateWalkwayUseCaseCodes.FAILURE,
			};
		}
	}
}
