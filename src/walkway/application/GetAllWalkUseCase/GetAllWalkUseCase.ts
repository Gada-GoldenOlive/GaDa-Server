import { Inject } from '@nestjs/common';

import { UseCase } from '../../../common/application/UseCase';
import { WALK_FINISH_STATUS } from '../../domain/Walk/WalkFinishStatus';
import { IWalkRepository, WALK_REPOSITORY } from '../../infra/IWalkRepository';
import { IGetAllWalkUseCaseRequest } from './dto/GetAllWalkUseCaseRequest';
import { IGetAllWalkUseCaseResponse } from './dto/GetAllWalkUseCaseResponse';

export enum GetAllWalkUseCaseCodes {
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
}

export class GetAllWalkUseCase implements UseCase<IGetAllWalkUseCaseRequest, IGetAllWalkUseCaseResponse> {
    constructor(
        @Inject(WALK_REPOSITORY)
        private readonly walkRepository: IWalkRepository,
    ) {}

    async execute(request: IGetAllWalkUseCaseRequest): Promise<IGetAllWalkUseCaseResponse> {
        try {
            const walks = await this.walkRepository.getAll({
                user: request.user,
                finishStatus: request.finishStatus as WALK_FINISH_STATUS,
            });

            return {
                code: GetAllWalkUseCaseCodes.SUCCESS,
                walks,
            };
        } catch {
            return {
                code: GetAllWalkUseCaseCodes.FAILURE,
            };
        }
    }
}
