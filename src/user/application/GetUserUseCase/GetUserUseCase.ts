import _ from 'lodash';
import { Inject } from '@nestjs/common';

import { UseCase } from '../../../common/application/UseCase';
import { User } from '../../domain/User/User';
import { IUserRepository, USER_REPOSITORY } from '../../infra/IUserRepository';
import { IGetUserUseCaseRequest } from './dto/IGetUserUseCaseRequest';
import { IGetUserUseCaseResponse } from './dto/IGetUserUseCaseResponse';

export enum GetUserUseCaseCodes {
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
    DUPLICATE_LOGIN_ID_ERROR = 'Request user\'s login id is duplicated.',
    DUPLICATE_NAME_ERROR = 'Request user\'s nickname is duplicated.',
    NO_EXIST_USER = 'NO_EXIST_USER',
}

export class GetUserUseCase implements UseCase<IGetUserUseCaseRequest, IGetUserUseCaseResponse> {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
    ) {}

    async execute(request: IGetUserUseCaseRequest): Promise<IGetUserUseCaseResponse> {
        try {
            if (_.isNil(request.id) && _.isNil(request.loginId) && _.isNil(request.name)) {
                return {
                    code: GetUserUseCaseCodes.NO_EXIST_USER,
                };
            }

            let user: User;

            if (request.id && !request.loginId && !request.name) {
                const foundUser = await this.userRepository.findOne({
                    id: request.id,
                });

                user = foundUser;
            }

            // NOTE: login id만 들어왔을 때
            if (!request.id && request.loginId && !request.name) {
                const foundUser = await this.userRepository.findOne(request);

                if(foundUser && request.isCheckDuplicated) {  // NOTE: 회원가입 때 아이디 중복 검사
                    return {
                        code: GetUserUseCaseCodes.DUPLICATE_LOGIN_ID_ERROR,
                    };
                }

                user = foundUser;
            }

            // NOTE: name만 들어왔을 때
            if (!request.id && !request.loginId && request.name) {
                const foundUser = await this.userRepository.findOne(request);

                if(foundUser && request.isCheckDuplicated) { // NOTE: 회원가입 때 닉네임 중복 검사
                    return {
                        code: GetUserUseCaseCodes.DUPLICATE_NAME_ERROR,
                    };
                }
            }
            
            if (!user) {
                return {
                    code: GetUserUseCaseCodes.NO_EXIST_USER,
                }
            }

            return {
                code: GetUserUseCaseCodes.SUCCESS,
                user,
            };
        } catch {
            return {
                code: GetUserUseCaseCodes.FAILURE,
            };
        }
    }
}
