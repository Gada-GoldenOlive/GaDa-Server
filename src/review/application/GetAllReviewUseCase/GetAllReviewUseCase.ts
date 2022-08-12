import { Inject } from '@nestjs/common';

import { UseCase } from '../../../common/application/UseCase';
import { IReviewRepository, REVIEW_REPOSITORY } from '../../infra/IReviewRepository';
import { GetAllReviewOptions } from '../../infra/mysql/MysqlReviewRepository';
import { IGetAllReviewUseCaseResponse } from './dto/IGetAllReviewUseCaseResponse';

export enum GetAllReviewUseCaseCodes {
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
}

export class GetAllReviewUseCase implements UseCase<GetAllReviewOptions, IGetAllReviewUseCaseResponse> {
    constructor(
        @Inject(REVIEW_REPOSITORY)
        private readonly pinRepository: IReviewRepository,
    ) {}

    async execute(request: GetAllReviewOptions): Promise<IGetAllReviewUseCaseResponse> {
        try {
            const reviews = await this.pinRepository.getAll({
                walkway: request.walkway,
            });

            let sumStar: number;

            for (let i in reviews) {
                sumStar += reviews[i].star.value;
            }

            const averageStar = sumStar / reviews.length;

            return {
                code: GetAllReviewUseCaseCodes.SUCCESS,
                reviews,
                averageStar,
            };
        } catch {
            return {
                code: GetAllReviewUseCaseCodes.FAILURE,
            };
        }
    }
}
