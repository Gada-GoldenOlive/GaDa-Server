import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { UseCase } from '../../../common/application/UseCase';
import { ImageUrl } from '../../../common/domain/Image/ImageUrl';
import { User } from '../../domain/User';
import { UserId } from '../../domain/UserId';
import { UserName } from '../../domain/UserName';
import { UserPassword } from '../../domain/UserPassword';
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

			const user = User.createNew({
				userId: UserId.create(request.userId).value,
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
