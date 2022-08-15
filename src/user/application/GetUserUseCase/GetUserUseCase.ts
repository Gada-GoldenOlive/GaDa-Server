import { Inject, Logger } from '@nestjs/common';
import _ from 'lodash';

import { UseCase } from '../../../common/application/UseCase';
import { User } from '../../domain/User';
import { IUserRepository, USER_REPOSITORY } from '../../infra/IUserRepository';
import { IGetUserUseCaseRequest } from './dto/IGetUserUseCaseRequest';
import { IGetUserUseCaseResponse } from './dto/IGetUserUseCaseResponse';

export enum GetUserUseCaseCodes {
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
    DUPLICATE_USER_ID_ERROR = 'Request user id is duplicated.',
}

export class GetUserUseCase implements UseCase<IGetUserUseCaseRequest, IGetUserUseCaseResponse> {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
    ) {}

    async execute(request: IGetUserUseCaseRequest): Promise<IGetUserUseCaseResponse> {
        try {
            if (_.isNil(request.id) && _.isNil(request.userId)) return null;

            let user: User;

            if (request.id && !request.userId) {
                const foundUser = await this.userRepository.findOne(request);

                user = foundUser;
            }

            // NOTE: user id만 들어왔을 때 (중복 검사)
            if (request.userId && !request.id) {
                const foundUser = await this.userRepository.findOne(request);

                if(foundUser) {
                    return {
                        code: GetUserUseCaseCodes.DUPLICATE_USER_ID_ERROR,
                    };
                }

                user = foundUser;
            }

            return {
                code: GetUserUseCaseCodes.SUCCESS,
                user,
            };
        } catch (e) {
            Logger.log(e);
            return {
                code: GetUserUseCaseCodes.FAILURE,
            };
        }
    }
}
