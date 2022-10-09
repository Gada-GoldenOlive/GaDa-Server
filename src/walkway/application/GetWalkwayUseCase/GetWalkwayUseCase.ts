import _ from 'lodash';
import { Inject } from '@nestjs/common';

import { UseCase } from '../../../common/application/UseCase';
import { IWalkwayRepository, WALKWAY_REPOSITORY } from '../../infra/IWalkwayRepository';
import { IGetWalkwayUseCaseResponse } from './dto/GetWalkwayResponse';
import { IGetWalkwayUseCaseRequest } from './dto/GetWalkwayUseCaseRequest';

export enum GetWalkwayUseCaseCodes {
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
    NOT_EXIST_WALKWAY = 'NOT_EXIST_WALKWAY'
}

export class GetWalkwayUseCase implements UseCase<
IGetWalkwayUseCaseRequest, IGetWalkwayUseCaseResponse> {
    constructor(
        @Inject(WALKWAY_REPOSITORY)
        private readonly walkwayRepository: IWalkwayRepository,
    ) {}

    async execute(request?: IGetWalkwayUseCaseRequest): Promise<IGetWalkwayUseCaseResponse> {
        try {
            if (_.isNil(request.id)) {
                return {
                    code: GetWalkwayUseCaseCodes.NO_EXIST_WALKWAY,
                };
            }
            
            const walkway = await this.walkwayRepository.findOne(request.id);

            if (!walkway) {
                return {
                    code: GetWalkwayUseCaseCodes.NOT_EXIST_WALKWAY,
                };
            }
            
            return {
                code: GetWalkwayUseCaseCodes.SUCCESS,
                walkway,
            };
        } catch {
            return {
                code: GetWalkwayUseCaseCodes.FAILURE,
            };
        }
    }
}
