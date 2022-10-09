import _ from 'lodash';
import { Inject } from '@nestjs/common';

import { UseCase } from '../../../common/application/UseCase';
import { IReviewRepository, REVIEW_REPOSITORY } from '../../infra/IReviewRepository';
import { IGetReviewUseCaseResponse } from './dto/GetReviewUseCaseResponse';
import { IGetReviewUseCaseRequest } from './dto/GetReviewUseCaseRequest';

export enum GetReviewUseCaseCodes {
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
    NOT_EXIST_REVIEW = 'NOT_EXIST_REVIEW'
}

export class GetReviewUseCase implements UseCase<
IGetReviewUseCaseRequest, IGetReviewUseCaseResponse> {
    constructor(
        @Inject(REVIEW_REPOSITORY)
        private readonly reviewRepository: IReviewRepository,
    ) {}

    async execute(request?: IGetReviewUseCaseRequest): Promise<IGetReviewUseCaseResponse> {
        try {
            if (_.isNil(request.id))
                return {
                    code: GetReviewUseCaseCodes.NOT_EXIST_REVIEW,
                };
            
            const review = await this.reviewRepository.getOne(request.id);

            if (!review) {
                return {
                    code: GetReviewUseCaseCodes.NOT_EXIST_REVIEW,
                };
            }
            
            return {
                code: GetReviewUseCaseCodes.SUCCESS,
                review,
            };
        } catch {
            return {
                code: GetReviewUseCaseCodes.FAILURE,
            };
        }
    }
}
