import { Inject } from '@nestjs/common';

import { UseCase } from '../../../common/application/UseCase';
import { Like } from '../../domain/Like/Like';
import { ILikeRepository, LIKE_REPOSITORY } from '../../infra/ILikeRepository';
import { ICreateLikeUseCaseRequest } from './dto/ICreateLikeUseCaseRequest';
import { ICreateLikeUseCaseResponse } from './dto/ICreateLikeUseCaseResponse';


export enum CreateLikeUseCaseCodes {
	SUCCESS = 'SUCCESS',
	FAILURE = 'FAILURE',
}

export class CreateLikeUseCase implements UseCase<ICreateLikeUseCaseRequest, ICreateLikeUseCaseResponse> {
	constructor(
		@Inject(LIKE_REPOSITORY)
		private readonly likeRepository: ILikeRepository,
	) {}

	async execute(request: ICreateLikeUseCaseRequest): Promise<ICreateLikeUseCaseResponse> {
		try {
			const like = Like.createNew({
				review: request.review,
				user: request.user,
			}).value;

			await this.likeRepository.save(like);

			return {
				code: CreateLikeUseCaseCodes.SUCCESS,
			};
		} catch {
			return {
				code: CreateLikeUseCaseCodes.FAILURE,
			};
		}
	}
}
