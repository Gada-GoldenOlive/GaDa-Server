import _ from 'lodash';
import { Inject } from '@nestjs/common';

import { UseCase } from '../../../common/application/UseCase';
import { ILikeRepository, LIKE_REPOSITORY } from '../../infra/ILikeRepository';
import { IGetLikeUseCaseResponse } from './dto/GetLikeUseCaseResponse';
import { IGetLikeUseCaseRequest } from './dto/GetLikeUseCaseRequest';

export enum GetLikeUseCaseCodes {
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
}

export class GetLikeUseCase implements UseCase<
IGetLikeUseCaseRequest, IGetLikeUseCaseResponse> {
    constructor(
        @Inject(LIKE_REPOSITORY)
        private readonly likeRepository: ILikeRepository,
    ) {}

    async execute(request?: IGetLikeUseCaseRequest): Promise<IGetLikeUseCaseResponse> {
        try {
            if (_.isNil(request.user) || _.isNil(request.review)) return null;
            
            const like = await this.likeRepository.findOne(request.user, request.review);
            
            return {
                code: GetLikeUseCaseCodes.SUCCESS,
                like,
            };
        } catch {
            return {
                code: GetLikeUseCaseCodes.FAILURE,
            };
        }
    }
}
