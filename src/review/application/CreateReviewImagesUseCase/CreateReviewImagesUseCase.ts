import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { UseCase } from '../../../common/application/UseCase';
import { Image } from '../../../common/domain/Image/Image';
import { ImageUrl } from '../../../common/domain/Image/ImageUrl';
import { IReviewImageRepository, REVIEW_IMAGE_REPOSITORY } from '../../infra/IReviewImageRepository';
import { ICreateReviewImagesUseCaseRequest } from './dto/ICreateReviewImagesRequest';
import { ICreateReviewImagesUseCaseResponse } from './dto/ICreateReviewImagesResponse';

export enum CreateReviewImagesUseCaseCodes {
	SUCCESS = 'SUCCESS',
	FAILURE = 'FAILURE',
}

export class CreateReviewImagesUseCase implements UseCase<ICreateReviewImagesUseCaseRequest, ICreateReviewImagesUseCaseResponse> {
	constructor(
		@Inject(REVIEW_IMAGE_REPOSITORY)
		private readonly reviewImageRepository: IReviewImageRepository,
	) {}

	async execute(request: ICreateReviewImagesUseCaseRequest): Promise<ICreateReviewImagesUseCaseResponse> {
		try {
			const reviewImages = _.map((request.urls), (url) => Image.createNew({
				review: request.review,
				url: ImageUrl.create(url).value,
			}).value);

			await this.reviewImageRepository.saveAll(reviewImages);

			return {
				code: CreateReviewImagesUseCaseCodes.SUCCESS,
			};
		} catch {
			return {
				code: CreateReviewImagesUseCaseCodes.FAILURE,
			};
		}
	}
}
