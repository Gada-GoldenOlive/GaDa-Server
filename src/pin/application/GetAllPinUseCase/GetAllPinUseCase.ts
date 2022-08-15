import { Inject } from '@nestjs/common';

import { UseCase } from '../../../common/application/UseCase';
import { IPinRepository, PIN_REPOSITORY } from '../../infra/IPinRepository';
import { IGetAllPinUseCaseRequest } from './dto/IGetAllPinUseCaseRequest';
import { IGetAllPinUseCaseResponse } from './dto/IGetAllPinUseCaseResponse';

export enum GetAllPinUseCaseCodes {
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
}

export class GetAllPinUseCase implements UseCase<IGetAllPinUseCaseRequest, IGetAllPinUseCaseResponse> {
    constructor(
        @Inject(PIN_REPOSITORY)
        private readonly pinRepository: IPinRepository,
    ) {}

    async execute(request: IGetAllPinUseCaseRequest): Promise<IGetAllPinUseCaseResponse> {
        try {
            const pins = await this.pinRepository.findAll(request);

            return {
                code: GetAllPinUseCaseCodes.SUCCESS,
                pins,
            };
        } catch {
            return {
                code: GetAllPinUseCaseCodes.FAILURE,
            };
        }
    }
}
