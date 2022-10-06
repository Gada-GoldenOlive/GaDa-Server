import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { UseCase } from '../../../common/application/UseCase';
import { ImageUrl } from '../../../common/domain/Image/ImageUrl';
import { User } from '../../domain/User/User';
import { UserLoginId } from '../../domain/User/UserLoginId';
import { UserName } from '../../domain/User/UserName';
import { UserPassword } from '../../domain/User/UserPassword';
import { IUserRepository, USER_REPOSITORY } from '../../infra/IUserRepository';
import { ICreateUserUseCaseRequest } from './dto/ICreateUserUseCaseRequest';
import { ICreateUserUseCaseResponse } from './dto/ICreateUserUseCaseResponse';

export enum CreateUserUseCaseCodes {
	SUCCESS = 'SUCCESS',
	FAILURE = 'FAILURE',
	DUPLICATE_USER_ID_ERROR = 'Request user id is duplicated.',
}


export class CreateUserUseCase implements UseCase<ICreateUserUseCaseRequest, ICreateUserUseCaseResponse> {
	constructor(
		@Inject(USER_REPOSITORY)
		private readonly userRepository: IUserRepository,
	) {}

	async execute(request: ICreateUserUseCaseRequest): Promise<ICreateUserUseCaseResponse> {
		try {
			const foundUser = await this.userRepository.findOne(request);

			if (foundUser) {
				return {
					code: CreateUserUseCaseCodes.DUPLICATE_USER_ID_ERROR,
				};
			}

			// TODO: 유저 생성할 때 닉네임(name) 중복검사 코드도 작성 요망

			const user = User.createNew({
				loginId: UserLoginId.create(request.loginId).value,
				password: UserPassword.create(request.password).value,
				name: UserName.create(request.name).value,
				image: request.image ? ImageUrl.create(request.image).value : null,
			}).value;

			await this.userRepository.save(user);

			return {
				code: CreateUserUseCaseCodes.SUCCESS,
				user,
			};
		} catch {
			return {
				code: CreateUserUseCaseCodes.FAILURE,
			};
		}
	}
}
