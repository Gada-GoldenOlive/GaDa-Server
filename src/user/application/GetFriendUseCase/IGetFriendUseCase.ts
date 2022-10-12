import _ from 'lodash';
import { Inject } from '@nestjs/common';

import { UseCase } from '../../../common/application/UseCase';
import { IFriendRepository, FRIEND_REPOSITORY } from '../../infra/IFriendRepository';
import { IGetFriendUseCaseResponse } from './dto/GetFriendUseCaseResponse';
import { IGetFriendUseCaseRequest } from './dto/GetFriendUseCaseRequest';

export enum GetFriendUseCaseCodes {
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
}

export class GetFriendUseCase implements UseCase<
IGetFriendUseCaseRequest, IGetFriendUseCaseResponse> {
    constructor(
        @Inject(FRIEND_REPOSITORY)
        private readonly friendRepository: IFriendRepository,
    ) {}

    async execute(request?: IGetFriendUseCaseRequest): Promise<IGetFriendUseCaseResponse> {
        try {            
            const friend = await this.friendRepository.findOne({
                user1: request.user1,
                user2: request.user2,
            });

            return {
                code: GetFriendUseCaseCodes.SUCCESS,
                friend,
            };
        } catch {
            return {
                code: GetFriendUseCaseCodes.FAILURE,
            };
        }
    }
}
