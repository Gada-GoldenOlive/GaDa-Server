import { Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';

import { UseCase } from '../../../common/application/UseCase';
import { ImageUrl } from '../../../common/domain/Image/ImageUrl';
import { User } from '../../domain/User/User';
import { UserGoalDistance } from '../../domain/User/UserGoalDistance';
import { UserGoalTime } from '../../domain/User/UserGoalTime';
import { UserLoginId } from '../../domain/User/UserLoginId';
import { UserName } from '../../domain/User/UserName';
import { UserPassword } from '../../domain/User/UserPassword';
import { UserRefreshToken } from '../../domain/User/UserRefreshToken';
import { IUserRepository, USER_REPOSITORY } from '../../infra/IUserRepository';
import { IUpdateUserUseCaseRequest } from './dto/IUpdateUserUseCaseRequest';
import { IUpdateUserUseCaseResponse } from './dto/IUpdateUserUseCaseResponse';
import { UserTotalTime } from '../../domain/User/UserTotalTime';
import { UserTotalDistance } from '../../domain/User/UserTotalDistance';

export enum UpdateUserUseCaseCodes {
	SUCCESS = 'SUCCESS',
	FAILURE = 'FAILURE',
	NOT_EXIST_USER = 'Corresponding user does not exist.',
	DUPLICATE_USER_NAME_ERROR = 'Request user name is duplicated.',
	WRONG_PASSWORD = 'Invalid password',
}

async function hashing(refreshToken: string): Promise<string> {
	if (refreshToken) {
		try {
			return await bcrypt.hash(refreshToken, 10);
		} catch (e) {
			throw new InternalServerErrorException();
		}
	}
}

export class UpdateUserUseCase implements UseCase<IUpdateUserUseCaseRequest, IUpdateUserUseCaseResponse> {
	constructor(
		@Inject(USER_REPOSITORY)
		private readonly userRepository: IUserRepository,
	) {}

	async execute(request: IUpdateUserUseCaseRequest): Promise<IUpdateUserUseCaseResponse> {
		try {
			const foundUser = await this.userRepository.findOne({ id: request.id });

			// NOTE: 업데이트 요청한 유저가 존재하지 않는 경우
			if (!foundUser) {
				return {
					code: UpdateUserUseCaseCodes.NOT_EXIST_USER,
				};
			}

			// NOTE: name이 있다면 name을 바꾸겠다는 뜻 -> 중복 검사 (닉네임도 중복 안 됨.)
			if (request.name) {
				const foundDuplicatedUserWithName = await this.userRepository.findOne({ name: request.name });

				if (foundDuplicatedUserWithName) {
					return {
						code: UpdateUserUseCaseCodes.DUPLICATE_USER_NAME_ERROR,
					};
				}
			}

			if (request.originPassword) {
				if(!(await UpdateUserUseCase.checkPassword(request.originPassword, foundUser))) {
					return {
						code: UpdateUserUseCaseCodes.WRONG_PASSWORD,
					};
				}
			}

			// NOTE: request로 들어온 게 없으면 request에 기존 것들 넣어줌 (아래에서 통일성을 위해 작성한 코드)
			if (!request.password) request.password = foundUser.password.value;
			else request.password = await hashing(request.password);
			if (!request.name) request.name = foundUser.name.value;
			if (!request.image) foundUser.image ? request.image = foundUser.image.value : request.image = null;
			if (!request.goalDistance) request.goalDistance = foundUser.goalDistance.value;
			if (!request.goalTime) request.goalTime = foundUser.goalTime.value;
			if (!request.totalDistance) request.totalDistance = foundUser.totalDistance.value;
			if (!request.totalTime) request.totalTime = foundUser.totalTime.value;
			if (!request.refreshToken) request.refreshToken = foundUser.refreshToken ? foundUser.refreshToken.value : null;
			else request.refreshToken = await hashing(request.refreshToken);

			const user = User.create({
				loginId: UserLoginId.create(foundUser.loginId.value).value,
				password: UserPassword.create(request.password).value,
				name: UserName.create(request.name).value,
				image: request.image ? ImageUrl.create(request.image).value : null,
				goalDistance: UserGoalDistance.create(request.goalDistance).value,
				goalTime: UserGoalTime.create(request.goalTime).value,
				totalDistance: UserTotalDistance.create(request.totalDistance).value,
				totalTime: UserTotalTime.create(request.totalTime).value,
				createdAt: foundUser.createdAt,
				updatedAt: new Date(),
				refreshToken: request.refreshToken ? UserRefreshToken.create(request.refreshToken).value : null,
			}, request.id).value;
			
			await this.userRepository.save(user);

			return {
				code: UpdateUserUseCaseCodes.SUCCESS,
				user,
			};
		} catch {
			return {
				code: UpdateUserUseCaseCodes.FAILURE,
			};
		}
	}

	private static async checkPassword(
		requestPassword: string,
		user: User,
	): Promise<boolean> {
		return await bcrypt.compare(requestPassword, user.password.value);
	}
}
