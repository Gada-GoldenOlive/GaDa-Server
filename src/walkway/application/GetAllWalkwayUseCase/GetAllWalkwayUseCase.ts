import { Inject } from '@nestjs/common';

import { UseCase } from '../../../common/application/UseCase';
import { IWalkwayRepository, WALKWAY_REPOSITORY } from '../../infra/IWalkwayRepository';
import { IGetAllWalkwayUseCaseRequest } from './dto/GetAllWalkwayUseCaseRequest';
import { IGetAllWalkwayUseCaseResponse } from './dto/GetAllWalkwayUseCaseResponse';

export enum GetAllWalkwayUseCaseCodes {
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
}

export class GetAllWalkwayUseCase implements UseCase<IGetAllWalkwayUseCaseRequest, IGetAllWalkwayUseCaseResponse> {
    constructor(
        @Inject(WALKWAY_REPOSITORY)
        private readonly walkwayRepository: IWalkwayRepository,
    ) {}

    async execute(request: IGetAllWalkwayUseCaseRequest): Promise<IGetAllWalkwayUseCaseResponse> {
        try {
            const walkways = await this.walkwayRepository.findAll(request.coordinates, request.userId);

            return {
                code: GetAllWalkwayUseCaseCodes.SUCCESS,
                walkways,
            };
        } catch {
            return {
                code: GetAllWalkwayUseCaseCodes.FAILURE,
            };
        }
    }
}
