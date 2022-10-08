import { Inject } from '@nestjs/common';

import { UseCase } from '../../../common/application/UseCase';
import { Friend } from '../../domain/Friend/Friend';
import { FriendStatus } from '../../domain/Friend/FriendStatus';
import { FRIEND_REPOSITORY, IFriendRepository } from '../../infra/IFriendRepository';
import { IDeleteFriendUseCaseRequest } from './dto/IDeleteFriendUseCaseRequest';
import { IDeleteFriendUseCaseResponse } from './dto/IDeleteFriendUseCaseResponse';

export enum DeleteFriendUseCaseCodes {
	SUCCESS = 'SUCCESS',
	FAILURE = 'FAILURE',
	NO_EXIST_FRIEND = 'Corresponding friend does not exist.',
}

export class DeleteFriendUseCase implements UseCase<IDeleteFriendUseCaseRequest, IDeleteFriendUseCaseResponse> {
	constructor(
		@Inject(FRIEND_REPOSITORY)
		private readonly friendRepository: IFriendRepository,
	) {}

	async execute(request: IDeleteFriendUseCaseRequest): Promise<IDeleteFriendUseCaseResponse> {
		try {
			// NOTE: 업데이트 요청한 Friend가 존재하지 않는 경우
			const foundFriend = await this.friendRepository.findOne(request.id);

			if (!foundFriend) {
				return {
					code: DeleteFriendUseCaseCodes.NO_EXIST_FRIEND,
				};
			}

			const friend = Friend.create({
				status: FriendStatus.DELETE,
				user1: foundFriend.user1,
				user2: foundFriend.user2,
				createdAt: foundFriend.createdAt,
				updatedAt: new Date(),
			}, request.id).value;
			
			await this.friendRepository.save(friend);

			return {
				code: DeleteFriendUseCaseCodes.SUCCESS,
			};
		} catch {
			return {
				code: DeleteFriendUseCaseCodes.FAILURE,
			};
		}
	}
}
