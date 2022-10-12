import { Inject } from '@nestjs/common';

import { UseCase } from '../../../common/application/UseCase';
import { Like } from '../../domain/Like/Like';
import { LikeStatus } from '../../domain/Like/LikeStatus';
import { LIKE_REPOSITORY, ILikeRepository } from '../../infra/ILikeRepository';
import { IUpdateLikeUseCaseRequest } from './dto/IUpdateLikeUseCaseRequest';
import { IUpdateLikeUseCaseResponse } from './dto/IUpdateLikeUseCaseResponse';

export enum UpdateLikeUseCaseCodes {
	SUCCESS = 'SUCCESS',
	FAILURE = 'FAILURE',
	NOT_EXIST_LIKE = 'Corresponding like does not exist.',
}

export class UpdateLikeUseCase implements UseCase<IUpdateLikeUseCaseRequest, IUpdateLikeUseCaseResponse> {
	constructor(
		@Inject(LIKE_REPOSITORY)
		private readonly likeRepository: ILikeRepository,
	) {}

	async execute(request: IUpdateLikeUseCaseRequest): Promise<IUpdateLikeUseCaseResponse> {
		try {
			const foundLike = request.like;

			if (!request.status) request.status = foundLike.status;

			const like = Like.create({
				status: request.status,
				user: foundLike.user,
				review: foundLike.review,
				createdAt: foundLike.createdAt,
				updatedAt: new Date(),
			}, foundLike.id).value;
			
			await this.likeRepository.save(like);

			return {
				code: UpdateLikeUseCaseCodes.SUCCESS,
			};
		} catch {
			return {
				code: UpdateLikeUseCaseCodes.FAILURE,
			};
		}
	}
}
