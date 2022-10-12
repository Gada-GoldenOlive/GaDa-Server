import _ from 'lodash';
import { Inject } from '@nestjs/common';

import { UseCase } from '../../../common/application/UseCase';
import { IUserRepository, USER_REPOSITORY } from '../../infra/IUserRepository';
import { IGetAllUserUseCaseRequest } from './dto/IGetAllUserUseCaseRequest';
import { IGetAllUserUseCaseResponse } from './dto/IGetAllUserUseCaseResponse';

export enum GetAllUserUseCaseCodes {
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
}

export class GetAllUserUseCase implements UseCase<IGetAllUserUseCaseRequest, IGetAllUserUseCaseResponse> {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
    ) {}

    async execute(request: IGetAllUserUseCaseRequest): Promise<IGetAllUserUseCaseResponse> {
        try {
            const users = await this.userRepository.findAll(request.loginId);

            return {
                code: GetAllUserUseCaseCodes.SUCCESS,
                users,
            };
        } catch {
            return {
                code: GetAllUserUseCaseCodes.FAILURE,
            };
        }
    }
}
