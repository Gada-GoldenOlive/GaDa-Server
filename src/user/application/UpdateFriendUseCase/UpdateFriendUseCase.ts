import { Inject } from '@nestjs/common';

import { UseCase } from '../../../common/application/UseCase';
import { Friend } from '../../domain/Friend/Friend';
import { FRIEND_REPOSITORY, IFriendRepository } from '../../infra/IFriendRepository';
import { IUpdateFriendUseCaseRequest } from './dto/IUpdateFriendUseCaseRequest';
import { IUpdateFriendUseCaseResponse } from './dto/IUpdateFriendUseCaseResponse';

export enum UpdateFriendUseCaseCodes {
	SUCCESS = 'SUCCESS',
	FAILURE = 'FAILURE',
	NOT_EXIST_FRIEND = 'Corresponding friend does not exist.',
}

export class UpdateFriendUseCase implements UseCase<IUpdateFriendUseCaseRequest, IUpdateFriendUseCaseResponse> {
	constructor(
		@Inject(FRIEND_REPOSITORY)
		private readonly friendRepository: IFriendRepository,
	) {}

	async execute(request: IUpdateFriendUseCaseRequest): Promise<IUpdateFriendUseCaseResponse> {
		try {
			// NOTE: 업데이트 요청한 Friend가 존재하지 않는 경우
			const foundFriend = await this.friendRepository.findOne({ id: request.id });

			if (!foundFriend) {
				return {
					code: UpdateFriendUseCaseCodes.NOT_EXIST_FRIEND,
				};
			}

			if(!request.status) request.status = foundFriend.status;

			const friend = Friend.create({
				status: request.status,
				user1: foundFriend.user1,
				user2: foundFriend.user2,
				createdAt: foundFriend.createdAt,
				updatedAt: new Date(),
			}, request.id).value;
			
			await this.friendRepository.save(friend);

			return {
				code: UpdateFriendUseCaseCodes.SUCCESS,
			};
		} catch {
			return {
				code: UpdateFriendUseCaseCodes.FAILURE,
			};
		}
	}
}
