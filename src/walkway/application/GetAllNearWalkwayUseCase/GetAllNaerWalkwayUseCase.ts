import { Inject } from '@nestjs/common';

import { UseCase } from '../../../common/application/UseCase';
import { IWalkwayRepository, WALKWAY_REPOSITORY } from '../../infra/IWalkwayRepository';
import { IGetAllWalkwayUseCaseRequest } from './dto/GetAllNearWalkwayUseCaseRequest';
import { IGetAllWalkwayUseCaseResponse } from './dto/GetAllNearWalkwayUseCaseResponse';

export enum GetAllNearWalkwayUseCaseCodes {
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
}

export class GetAllNearWalkwayUseCase implements UseCase<IGetAllWalkwayUseCaseRequest, IGetAllWalkwayUseCaseResponse> {
    constructor(
        @Inject(WALKWAY_REPOSITORY)
        private readonly walkwayRepository: IWalkwayRepository,
    ) {}

    async execute(request: IGetAllWalkwayUseCaseRequest): Promise<IGetAllWalkwayUseCaseResponse> {
        try {
            const walkways = await this.walkwayRepository.findAll(request.coordinates);

            return {
                code: GetAllNearWalkwayUseCaseCodes.SUCCESS,
                walkways,
            };
        } catch {
            return {
                code: GetAllNearWalkwayUseCaseCodes.FAILURE,
            };
        }
    }
}
