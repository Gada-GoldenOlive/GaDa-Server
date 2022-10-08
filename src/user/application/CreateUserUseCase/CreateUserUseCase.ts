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
	DUPLICATE_LOGIN_ID_ERROR = 'Request user login id is duplicated.',
	DUPLICATE_NAME_ERROR = 'Request user name is duplicated.',
	DUPLICATE_LOGIN_ID_AND_NAME_ERROR = 'Request user login id and name are duplicated.',
}


export class CreateUserUseCase implements UseCase<ICreateUserUseCaseRequest, ICreateUserUseCaseResponse> {
	constructor(
		@Inject(USER_REPOSITORY)
		private readonly userRepository: IUserRepository,
	) {}

	async execute(request: ICreateUserUseCaseRequest): Promise<ICreateUserUseCaseResponse> {
		try {
			const foundUserWithLoginId = await this.userRepository.findOne({
				loginId: request.loginId,
			});

			const foundUserWithName = await this.userRepository.findOne({
				name: request.name,
			});

			if (foundUserWithLoginId && foundUserWithName) {
				return {
					code: CreateUserUseCaseCodes.DUPLICATE_LOGIN_ID_AND_NAME_ERROR,
				};
			}

			if (foundUserWithLoginId) {
				return {
					code: CreateUserUseCaseCodes.DUPLICATE_LOGIN_ID_ERROR,
				};
			}

			if (foundUserWithName) {
				return {
					code: CreateUserUseCaseCodes.DUPLICATE_NAME_ERROR,
				};
			}

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
