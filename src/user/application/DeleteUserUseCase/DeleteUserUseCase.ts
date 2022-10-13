import { Inject } from '@nestjs/common';
import { UseCase } from '../../../common/application/UseCase';
import { ImageUrl } from '../../../common/domain/Image/ImageUrl';
import { User } from '../../domain/User/User';
import { UserGoalDistance } from '../../domain/User/UserGoalDistance';
import { UserGoalTime } from '../../domain/User/UserGoalTime';
import { UserLoginId } from '../../domain/User/UserLoginId';
import { UserName } from '../../domain/User/UserName';
import { UserPassword } from '../../domain/User/UserPassword';
import { UserRefreshToken } from '../../domain/User/UserRefreshToken';
import { UserStatus } from '../../domain/User/UserStatus';
import { IUserRepository, USER_REPOSITORY } from '../../infra/IUserRepository';
import { IDeleteUserUseCaseRequest } from './dto/IDeleteUserUseCaseRequest';
import { IDeleteUserUseCaseResponse } from './dto/IDeleteUserUseCaseResponse';

export enum DeleteUserUseCaseCodes {
	SUCCESS = 'SUCCESS',
	FAILURE = 'FAILURE',
	NOT_EXIST_USER = 'Corresponding user does not exist.'
}

export class DeleteUserUseCase implements UseCase<IDeleteUserUseCaseRequest, IDeleteUserUseCaseResponse> {
	constructor(
		@Inject(USER_REPOSITORY)
		private readonly userRepository: IUserRepository,
	) {}

	async execute(request: IDeleteUserUseCaseRequest): Promise<IDeleteUserUseCaseResponse> {
		try {
			const foundUser = await this.userRepository.findOne({
				id: request.user.id,
			});

			if (!foundUser) {
				return {
					code: DeleteUserUseCaseCodes.NOT_EXIST_USER,
				};
			}

			const user = User.create({
				loginId: UserLoginId.create(foundUser.loginId.value).value,
				password: UserPassword.create(foundUser.password.value).value,
				name: UserName.create(foundUser.name.value).value,
				image: foundUser.image ? ImageUrl.create(foundUser.image.value).value : null,
				goalDistance: UserGoalDistance.create(foundUser.goalDistance.value).value,
				goalTime: UserGoalTime.create(foundUser.goalTime.value).value,
				totalDistance: foundUser.totalDistance,
				totalTime: foundUser.totalTime,
				weekDistance: foundUser.weekDistance,
				weekTime: foundUser.weekTime,
				createdAt: foundUser.createdAt,
				updatedAt: new Date(),
				status: UserStatus.DELETE,
				refreshToken: foundUser.refreshToken ? UserRefreshToken.create(foundUser.refreshToken.value).value : null,
			}, foundUser.id).value;

			await this.userRepository.save(user);

			return {
				code: DeleteUserUseCaseCodes.SUCCESS,
			};
		} catch {
			return {
				code: DeleteUserUseCaseCodes.FAILURE,
			};
		}
	}
}