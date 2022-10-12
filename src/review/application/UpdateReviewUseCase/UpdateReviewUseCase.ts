import { Inject } from '@nestjs/common';

import { UseCase } from '../../../common/application/UseCase';
import { Review } from '../../domain/Review/Review';
import { ReviewContent } from '../../domain/Review/ReviewContent';
import { ReviewStar } from '../../domain/Review/ReviewStar';
import { ReviewTitle } from '../../domain/Review/ReviewTitle';
import { REVIEW_REPOSITORY, IReviewRepository } from '../../infra/IReviewRepository';
import { IUpdateReviewUseCaseRequest } from './dto/IUpdateReviewUseCaseRequest';
import { IUpdateReviewUseCaseResponse } from './dto/IUpdateReviewUseCaseResponse';

export enum UpdateReviewUseCaseCodes {
	SUCCESS = 'SUCCESS',
	FAILURE = 'FAILURE',
	NOT_EXIST_REVIEW = 'Corresponding review does not exist.',
}

export class UpdateReviewUseCase implements UseCase<IUpdateReviewUseCaseRequest, IUpdateReviewUseCaseResponse> {
	constructor(
		@Inject(REVIEW_REPOSITORY)
		private readonly reviewRepository: IReviewRepository,
	) {}

	async execute(request: IUpdateReviewUseCaseRequest): Promise<IUpdateReviewUseCaseResponse> {
		try {
			// NOTE: 업데이트 요청한 Review가 존재하지 않는 경우
			const foundReview = await this.reviewRepository.getOne(request.id);

			if (!foundReview) {
				return {
					code: UpdateReviewUseCaseCodes.NOT_EXIST_REVIEW,
				};
			}

			if (!request.title) request.title = foundReview.title.value;
			if (!request.vehicle) request.vehicle = foundReview.vehicle;
			if (!request.star) request.star = foundReview.star.value;
			if (!request.content) request.content = foundReview.content.value;

			const review = Review.create({
				title: ReviewTitle.create(request.title).value,
				vehicle: request.vehicle,
				star: ReviewStar.create(request.star).value,
				content: ReviewContent.create(request.content).value,
				status: foundReview.status,
				walk: foundReview.walk,
				createdAt: foundReview.createdAt,
				updatedAt: new Date(),
			}, request.id).value;
			
			await this.reviewRepository.save(review);

			return {
				code: UpdateReviewUseCaseCodes.SUCCESS,
				review,
			};
		} catch {
			return {
				code: UpdateReviewUseCaseCodes.FAILURE,
			};
		}
	}
}
