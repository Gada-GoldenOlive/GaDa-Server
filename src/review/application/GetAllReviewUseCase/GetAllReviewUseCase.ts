import _ from 'lodash';
import { Inject } from '@nestjs/common';

import { UseCase } from '../../../common/application/UseCase';
import { IReviewRepository, REVIEW_REPOSITORY } from '../../infra/IReviewRepository';
import { GetAllReviewOptions, ReviewOrderOptions } from '../../infra/mysql/MysqlReviewRepository';
import { IGetAllReviewUseCaseResponse } from './dto/IGetAllReviewUseCaseResponse';
import { IGetAllReviewUseCaseRequest } from './dto/IGetAllReviewUseCaseRequest';

export enum GetAllReviewUseCaseCodes {
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
    NO_CURRENT_LOCATION = 'Current location is required for ordering by distance.'
}

export class GetAllReviewUseCase implements UseCase<GetAllReviewOptions, IGetAllReviewUseCaseResponse> {
    constructor(
        @Inject(REVIEW_REPOSITORY)
        private readonly reviewRepository: IReviewRepository,
    ) {}

    async execute(request: IGetAllReviewUseCaseRequest): Promise<IGetAllReviewUseCaseResponse> {
        try {
            if (request.reviewOrderOption === ReviewOrderOptions.DISTANCE && (_.isNil(request.lat) || _.isNil(request.lng))) {
                return {
                    code: GetAllReviewUseCaseCodes.NO_CURRENT_LOCATION,
                };
            }

            const reviews = await this.reviewRepository.getAll({
                reviewOrderOption: request.reviewOrderOption,
                user: request.user,
                walkway: request.walkway,
                curPoint: {
                    lat: request.lat,
                    lng: request.lng,
                }
            });
            
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
