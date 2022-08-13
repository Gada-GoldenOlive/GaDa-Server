import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { UseCase } from '../../../common/application/UseCase';
import { IUserRepository, USER_REPOSITORY } from '../../infra/IUserRepository';
import { IGetUserUseCaseRequest } from './dto/IGetUserUseCaseRequest';
import { IGetUserUseCaseResponse } from './dto/IGetUserUseCaseResponse';

export enum GetUserUseCaseCodes {
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
}

export class GetUserUseCase implements UseCase<IGetUserUseCaseRequest, IGetUserUseCaseResponse> {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
    ) {}

    async execute(request: IGetUserUseCaseRequest): Promise<IGetUserUseCaseResponse> {
        try {
            if (_.isNil(request.id)) return null;

            const user = await this.userRepository.findOne(request.id);

            return {
                code: GetUserUseCaseCodes.SUCCESS,
                user,
            };
        } catch {
            return {
                code: GetUserUseCaseCodes.FAILURE,
            }
        }
    }
}
