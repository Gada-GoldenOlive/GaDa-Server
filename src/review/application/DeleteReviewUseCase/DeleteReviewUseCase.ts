import { Inject } from '@nestjs/common';

import { UseCase } from '../../../common/application/UseCase';
import { Review } from '../../domain/Review/Review';
import { ReviewContent } from '../../domain/Review/ReviewContent';
import { ReviewStar } from '../../domain/Review/ReviewStar';
import { ReviewStatus } from '../../domain/Review/ReviewStatus';
import { ReviewTitle } from '../../domain/Review/ReviewTitle';
import { REVIEW_REPOSITORY, IReviewRepository } from '../../infra/IReviewRepository';
import { IDeleteReviewUseCaseRequest } from './dto/IDeleteReviewUseCaseRequest';
import { IDeleteReviewUseCaseResponse } from './dto/IDeleteReviewUseCaseResponse';

export enum DeleteReviewUseCaseCodes {
	SUCCESS = 'SUCCESS',
	FAILURE = 'FAILURE',
	NOT_EXIST_REVIEW = 'Corresponding review does not exist.',
}

export class DeleteReviewUseCase implements UseCase<IDeleteReviewUseCaseRequest, IDeleteReviewUseCaseResponse> {
	constructor(
		@Inject(REVIEW_REPOSITORY)
		private readonly reviewRepository: IReviewRepository,
	) {}

	async execute(request: IDeleteReviewUseCaseRequest): Promise<IDeleteReviewUseCaseResponse> {
		try {
			// NOTE: 업데이트 요청한 Review가 존재하지 않는 경우
			const foundReview = await this.reviewRepository.getOne(request.id);

			if (!foundReview) {
				return {
					code: DeleteReviewUseCaseCodes.NOT_EXIST_REVIEW,
				};
			}

			const review = Review.create({
				status: ReviewStatus.DELETE,
				title: ReviewTitle.create(foundReview.title.value).value,
				vehicle: foundReview.vehicle,
				star: ReviewStar.create(foundReview.star.value).value,
				content: ReviewContent.create(foundReview.content.value).value,
				walk: foundReview.walk,
				createdAt: foundReview.createdAt,
				updatedAt: new Date(),
			}, request.id).value;
			
			await this.reviewRepository.save(review);

			return {
				code: DeleteReviewUseCaseCodes.SUCCESS,
			};
		} catch {
			return {
				code: DeleteReviewUseCaseCodes.FAILURE,
			};
		}
	}
}
