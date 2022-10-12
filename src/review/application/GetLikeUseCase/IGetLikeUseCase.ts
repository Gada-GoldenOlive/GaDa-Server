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
            const like = await this.likeRepository.findOne({
                user: request.user, 
                review: request.review,
                is_include_delete: request.is_include_delete,
            });

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
