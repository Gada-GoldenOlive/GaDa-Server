import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { UseCase } from '../../../common/application/UseCase';
import { IReviewImageRepository, REVIEW_IMAGE_REPOSITORY } from '../../infra/IReviewImageRepository';
import { IDeleteAllReviewImageUseCaseRequest } from './dto/IDeleteAllReviewImageRequest';
import { IDeleteAllReviewImageUseCaseResponse } from './dto/IDeleteAllReviewImageResponse';

export enum DeleteAllReviewImageUseCaseCodes {
	SUCCESS = 'SUCCESS',
	FAILURE = 'FAILURE',
}

export class DeleteAllReviewImageUseCase implements UseCase<IDeleteAllReviewImageUseCaseRequest, IDeleteAllReviewImageUseCaseResponse> {
	constructor(
		@Inject(REVIEW_IMAGE_REPOSITORY)
		private readonly reviewImageRepository: IReviewImageRepository,
	) {}

	async execute(request: IDeleteAllReviewImageUseCaseRequest): Promise<IDeleteAllReviewImageUseCaseResponse> {
		try {
			await this.reviewImageRepository.deleteAll(request.ids);

			return {
				code: DeleteAllReviewImageUseCaseCodes.SUCCESS,
			};
		} catch (e){
            console.log(e)
			return {
				code: DeleteAllReviewImageUseCaseCodes.FAILURE,
			};
		}
	}
}
