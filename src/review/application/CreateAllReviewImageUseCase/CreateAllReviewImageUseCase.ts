import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { UseCase } from '../../../common/application/UseCase';
import { Image } from '../../../common/domain/Image/Image';
import { ImageUrl } from '../../../common/domain/Image/ImageUrl';
import { IReviewImageRepository, REVIEW_IMAGE_REPOSITORY } from '../../infra/IReviewImageRepository';
import { ICreateAllReviewImageUseCaseRequest } from './dto/ICreateAllReviewImageRequest';
import { ICreateAllReviewImageUseCaseResponse } from './dto/ICreateAllReviewImageResponse';

export enum CreateAllReviewImageUseCaseCodes {
	SUCCESS = 'SUCCESS',
	FAILURE = 'FAILURE',
}

export class CreateAllReviewImageUseCase implements UseCase<ICreateAllReviewImageUseCaseRequest, ICreateAllReviewImageUseCaseResponse> {
	constructor(
		@Inject(REVIEW_IMAGE_REPOSITORY)
		private readonly reviewImageRepository: IReviewImageRepository,
	) {}

	async execute(request: ICreateAllReviewImageUseCaseRequest): Promise<ICreateAllReviewImageUseCaseResponse> {
		try {
			const reviewImages = _.map((request.urls), (url) => Image.createNew({
				review: request.review,
				url: ImageUrl.create(url).value,
			}).value);

			await this.reviewImageRepository.saveAll(reviewImages);

			return {
				code: CreateAllReviewImageUseCaseCodes.SUCCESS,
			};
		} catch {
			return {
				code: CreateAllReviewImageUseCaseCodes.FAILURE,
			};
		}
	}
}
