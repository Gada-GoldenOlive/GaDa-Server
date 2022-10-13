import { Inject } from '@nestjs/common';

import { UseCase } from '../../../common/application/UseCase';
import { ILikeRepository, LIKE_REPOSITORY } from '../../infra/ILikeRepository';
import { IGetAllLikeUseCaseRequest } from './dto/GetAllLikeUseCaseRequest';
import { IGetAllLikeUseCaseResponse } from './dto/GetAllLikeUseCaseResponse';

export enum GetAllLikeUseCaseCodes {
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
}

export class GetAllLikeUseCase implements UseCase<IGetAllLikeUseCaseRequest, IGetAllLikeUseCaseResponse> {
    constructor(
        @Inject(LIKE_REPOSITORY)
        private readonly likeRepository: ILikeRepository,
    ) {}

    async execute(request: IGetAllLikeUseCaseRequest): Promise<IGetAllLikeUseCaseResponse> {
        try {
            const result = await this.likeRepository.findAll({
                user: request.user,
                review: request.review,
                paginationOptions: request.paginationOptions,
            });

            return {
                code: GetAllLikeUseCaseCodes.SUCCESS,
                likes: result.items,
                meta: result.meta,
                links: result.links,
            };
        } catch {
            return {
                code: GetAllLikeUseCaseCodes.FAILURE,
            };
        }
    }
}
