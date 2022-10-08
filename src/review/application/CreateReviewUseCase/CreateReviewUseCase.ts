import { Inject } from '@nestjs/common';

import { UseCase } from '../../../common/application/UseCase';
import { Review } from '../../domain/Review/Review';
import { ReviewContent } from '../../domain/Review/ReviewContent';
import { ReviewStar } from '../../domain/Review/ReviewStar';
import { ReviewTitle } from '../../domain/Review/ReviewTitle';
import { IReviewRepository, REVIEW_REPOSITORY } from '../../infra/IReviewRepository';
import { ICreateReviewUseCaseResponse } from './dto/ICreateReviewUseCaseReqponse';
import { ICreateReviewUseCaseRequest } from './dto/ICreateReviewUseCaseReuqest';

export enum CreateReviewUseCaseCodes {
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
}

export class CreateReviewUseCase implements UseCase<ICreateReviewUseCaseRequest, ICreateReviewUseCaseResponse> {
    constructor(
        @Inject(REVIEW_REPOSITORY)
        private readonly reviewRepository: IReviewRepository,
    ) {}

    async execute(request: ICreateReviewUseCaseRequest): Promise<ICreateReviewUseCaseResponse> {
        try {
            const review = Review.createNew({
                title: ReviewTitle.create(request.title).value,
                vehicle: request.vehicle,
                star: ReviewStar.create(request.star).value,
                content: ReviewContent.create(request.content).value,
                walk: request.walk,
            }).value;

            await this.reviewRepository.save(review);

            return {
                code: CreateReviewUseCaseCodes.SUCCESS,
                review,
            };
        } catch {
            return {
                code: CreateReviewUseCaseCodes.FAILURE,
            };
        }
    }
}
