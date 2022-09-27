import { Inject } from '@nestjs/common';

import { UseCase } from '../../../common/application/UseCase';
import { ImageUrl } from '../../../common/domain/Image/ImageUrl';
import { User } from '../../domain/User/User';
import { UserGoalDistance } from '../../domain/User/UserGoalDistance';
import { UserGoalTime } from '../../domain/User/UserGoalTime';
import { UserLoginId } from '../../domain/User/UserLoginId';
import { UserName } from '../../domain/User/UserName';
import { UserPassword } from '../../domain/User/UserPassword';
import { IUserRepository, USER_REPOSITORY } from '../../infra/IUserRepository';
import { IUpdateUserUseCaseRequest } from './dto/IUpdateUserUseCaseRequest';
import { IUpdateUserUseCaseResponse } from './dto/IUpdateUserUseCaseResponse';

export enum UpdateUserUseCaseCodes {
	SUCCESS = 'SUCCESS',
	FAILURE = 'FAILURE',
	NO_EXIST_USER = 'Corresponding user does not exist.',
	DUPLICATE_USER_ID_ERROR = 'Request user id is duplicated.',
}

export class UpdateUserUseCase implements UseCase<IUpdateUserUseCaseRequest, IUpdateUserUseCaseResponse> {
	constructor(
		@Inject(USER_REPOSITORY)
		private readonly userRepository: IUserRepository,
	) {}

	async execute(request: IUpdateUserUseCaseRequest): Promise<IUpdateUserUseCaseResponse> {
		try {
			// NOTE: 업데이트 요청한 유저가 존재하지 않는 경우
			const foundUser = await this.userRepository.findOne({ id: request.id });

			if (!foundUser) {
				return {
					code: UpdateUserUseCaseCodes.NO_EXIST_USER,
				};
			}

			// NOTE: loginId가 있다면 loginId를 바꾸겠다는 뜻 -> 중복 검사
			if (request.loginId) {
				const foundDuplicatedUserLoginId = await this.userRepository.findOne({ loginId: request.loginId });

				if (foundDuplicatedUserLoginId) {
					return {
						code: UpdateUserUseCaseCodes.DUPLICATE_USER_ID_ERROR,
					};
				}
			}

			// NOTE: request로 들어온 게 없으면 request에 기존 것들 넣어줌 (아래에서 통일성을 위해 작성한 코드)
			if (!request.loginId) request.loginId = foundUser.loginId.value;
			// TODO: 비밀번호 변경하는 것도 암호화 처리되게 해줘야 함
			if (!request.password) request.password = foundUser.password.value;
			if (!request.name) request.name = foundUser.name.value;
			if (!request.image) request.image = foundUser.image.value;
			if (!request.goalDistance) request.goalDistance = foundUser.goalDistance.value;
			if (!request.goalTime) request.goalTime = foundUser.goalTime.value;
			
			const user = User.create({
				loginId: UserLoginId.create(request.loginId).value,
				password: UserPassword.create(request.password).value,
				name: UserName.create(request.name).value,
				image: ImageUrl.create(request.image).value,
				goalDistance: UserGoalDistance.create(request.goalDistance).value,
				goalTime: UserGoalTime.create(request.goalTime).value,
				totalDistance: foundUser.totalDistance,
				totalTime: foundUser.totalTime,
				createdAt: foundUser.createdAt,
				updatedAt: new Date(),
			}, request.id).value;
			
			await this.userRepository.save(user);

			return {
				code: UpdateUserUseCaseCodes.SUCCESS,
			};
		} catch {
			return {
				code: UpdateUserUseCaseCodes.FAILURE,
			};
		}
	}
}