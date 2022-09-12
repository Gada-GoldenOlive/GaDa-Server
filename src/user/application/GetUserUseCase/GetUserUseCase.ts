import _ from 'lodash';
import { Inject, Logger } from '@nestjs/common';

import { UseCase } from '../../../common/application/UseCase';
import { User } from '../../domain/User/User';
import { IUserRepository, USER_REPOSITORY } from '../../infra/IUserRepository';
import { IGetUserUseCaseRequest } from './dto/IGetUserUseCaseRequest';
import { IGetUserUseCaseResponse } from './dto/IGetUserUseCaseResponse';

export enum GetUserUseCaseCodes {
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
    DUPLICATE_USER_ID_ERROR = 'Request user id is duplicated.',
    NO_USER_FOUND = 'No corresponding user found.',
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

            // NOTE: user id만 들어왔을 때
            if (!request.id && request.userId) {
                const foundUser = await this.userRepository.findOne(request);

                if(foundUser && request.isCheckDuplicated) {  // NOTE: 회원가입 때 아이디 중복 검사
                    return {
                        code: GetUserUseCaseCodes.DUPLICATE_USER_ID_ERROR,
                    };
                }

                user = foundUser;
            }

            if (!user) {
                return {
                    code: GetUserUseCaseCodes.NO_USER_FOUND,
                }
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
