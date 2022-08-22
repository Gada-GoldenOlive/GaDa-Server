import _ from 'lodash';
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
            const reviews = await this.pinRepository.getAll(request);
            
            let averageStar = 0;
            if (!_.isEmpty(reviews)) {
                let sumStar: number = 0;

                for (let i in reviews) {
                    sumStar += reviews[i].star.value;
                }

                averageStar = +(sumStar / reviews.length).toFixed(1);
            }

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
