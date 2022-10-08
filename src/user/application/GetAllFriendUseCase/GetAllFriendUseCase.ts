import _ from 'lodash';
import { Inject } from '@nestjs/common';

import { UseCase } from '../../../common/application/UseCase';
import { IFriendRepository, FRIEND_REPOSITORY } from '../../infra/IFriendRepository';
import { IGetAllFriendUseCaseRequest } from './dto/IGetAllFriendUseCaseRequest';
import { IGetAllFriendUseCaseResponse } from './dto/IGetAllFriendUseCaseResponse';

export enum GetAllFriendUseCaseCodes {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
}

export class GetAllFriendUseCase implements UseCase<IGetAllFriendUseCaseRequest, IGetAllFriendUseCaseResponse> {
	constructor(
		@Inject(FRIEND_REPOSITORY)
		private friendRepository: IFriendRepository,
  	) {}

	async execute(request: IGetAllFriendUseCaseRequest): Promise<IGetAllFriendUseCaseResponse> {
    	try {
      		const friends = await this.friendRepository.findAll({
                userId: request.userId,
                isRank: request.isRank,
            });

      		return {
        		code: GetAllFriendUseCaseCodes.SUCCESS,
                friends,
      		};
    	} catch {
			return {
				code: GetAllFriendUseCaseCodes.FAILURE,
			};
    	}
  	}
}
