import { Inject } from '@nestjs/common';

import { UseCase } from '../../../common/application/UseCase';
import { Like } from '../../domain/Like/Like';
import { LikeStatus } from '../../domain/Like/LikeStatus';
import { LIKE_REPOSITORY, ILikeRepository } from '../../infra/ILikeRepository';
import { IDeleteLikeUseCaseRequest } from './dto/IDeleteLikeUseCaseRequest';
import { IDeleteLikeUseCaseResponse } from './dto/IDeleteLikeUseCaseResponse';

export enum DeleteLikeUseCaseCodes {
	SUCCESS = 'SUCCESS',
	FAILURE = 'FAILURE',
	NOT_EXIST_LIKE = 'Corresponding like does not exist.',
}

export class DeleteLikeUseCase implements UseCase<IDeleteLikeUseCaseRequest, IDeleteLikeUseCaseResponse> {
	constructor(
		@Inject(LIKE_REPOSITORY)
		private readonly likeRepository: ILikeRepository,
	) {}

	async execute(request: IDeleteLikeUseCaseRequest): Promise<IDeleteLikeUseCaseResponse> {
		try {
			// NOTE: 업데이트 요청한 Like가 존재하지 않는 경우
			const foundLike = await this.likeRepository.findOne({
				id: request.id,
			});

			if (!foundLike) {
				return {
					code: DeleteLikeUseCaseCodes.NOT_EXIST_LIKE,
				};
			}

			const like = Like.create({
				status: LikeStatus.DELETE,
				user: foundLike.user,
				review: foundLike.review,
				createdAt: foundLike.createdAt,
				updatedAt: new Date(),
			}, request.id).value;
			
			await this.likeRepository.save(like);

			return {
				code: DeleteLikeUseCaseCodes.SUCCESS,
			};
		} catch {
			return {
				code: DeleteLikeUseCaseCodes.FAILURE,
			};
		}
	}
}
