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
            const likes = await this.likeRepository.findAll(request.user);

            return {
                code: GetAllLikeUseCaseCodes.SUCCESS,
                likes,
            };
        } catch {
            return {
                code: GetAllLikeUseCaseCodes.FAILURE,
            };
        }
    }
}
