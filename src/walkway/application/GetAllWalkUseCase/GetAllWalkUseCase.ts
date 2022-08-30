import { Inject } from '@nestjs/common';

import { UseCase } from '../../../common/application/UseCase';
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
        private readonly walkwayRepository: IWalkRepository,
    ) {}

    async execute(request: IGetAllWalkUseCaseRequest): Promise<IGetAllWalkUseCaseResponse> {
        try {
            const walks = await this.walkwayRepository.findAll(request.userId);

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
