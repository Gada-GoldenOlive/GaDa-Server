import _ from 'lodash';
import { Inject } from '@nestjs/common';

import { UseCase } from '../../../common/application/UseCase';
import { IWalkRepository, WALK_REPOSITORY } from '../../infra/IWalkRepository';
import { IGetWalkUseCaseResponse } from './dto/IGetWalkUseCaseResponse';
import { IGetWalkUseCaseRequest } from './dto/IGetWalkUseCaseRequest';

export enum GetWalkUseCaseCodes {
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
    NOT_EXIST_WALK = 'NOT_EXIST_WALK'
}

export class GetWalkUseCase implements UseCase<IGetWalkUseCaseRequest, IGetWalkUseCaseResponse> {
    constructor(
        @Inject(WALK_REPOSITORY)
        private readonly walkRepository: IWalkRepository,
    ) {}

    async execute(request?: IGetWalkUseCaseRequest): Promise<IGetWalkUseCaseResponse> {
        try {
            if (_.isNil(request.id)) return null;
            
            const walk = await this.walkRepository.findOne(request.id);

            if (!walk) {
                return {
                    code: GetWalkUseCaseCodes.NOT_EXIST_WALK,
                };
            }
            
            return {
                code: GetWalkUseCaseCodes.SUCCESS,
                walk,
            };
        } catch {
            return {
                code: GetWalkUseCaseCodes.FAILURE,
            };
        }
    }
}
