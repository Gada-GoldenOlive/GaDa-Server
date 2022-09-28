import _ from 'lodash';
import { Inject } from '@nestjs/common';

import { UseCase } from '../../../common/application/UseCase';
import { IReviewImageRepository, REVIEW_IMAGE_REPOSITORY } from '../../infra/IReviewImageRepository';
import { IGetAllReviewImageUseCaseRequest } from './dto/IGetAllReviewImageUseCaseRequest';
import { IGetAllReviewImageUseCaseResponse } from './dto/IGetAllReviewImageUseCaseResponse';

export enum GetAllReviewImageUseCaseCodes {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
}

export class GetAllReviewImageUseCase implements UseCase<IGetAllReviewImageUseCaseRequest, IGetAllReviewImageUseCaseResponse> {
	constructor(
		@Inject(REVIEW_IMAGE_REPOSITORY)
		private imageRepository: IReviewImageRepository,
  	) {}

	async execute(request: IGetAllReviewImageUseCaseRequest): Promise<IGetAllReviewImageUseCaseResponse> {
    	try {
      		const images = await this.imageRepository.getAll({
				reviewIds: request.reviewIds,
				imageIds: request.imageIds,
			});

      		return {
        		code: GetAllReviewImageUseCaseCodes.SUCCESS,
        		images,
      		};
    	} catch {
			return {
				code: GetAllReviewImageUseCaseCodes.FAILURE,
			};
    	}
  	}
}
