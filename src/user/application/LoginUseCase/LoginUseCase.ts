import _ from 'lodash';
import * as bcrypt from 'bcrypt';
import { Inject } from '@nestjs/common';

import { UseCase } from '../../../common/application/UseCase';
import { User } from '../../domain/User/User';
import { IUserRepository, USER_REPOSITORY } from '../../infra/IUserRepository';
import { ILoginUseCaseRequest } from './dto/ILoginUseCaserequest';
import { ILoginUseCaseResponse } from './dto/ILoginUseCaseResponse';

export enum LoginUseCaseCodes {
	SUCCESS= 'SUCCESS',
	FAILURE = 'FAILURE',
	WRONG_LOGIN_ID = 'User with requested ID does not exist.',
	WRONG_PASSWORD = 'Invalid password',
	PROPS_VALUES_ARE_REQUIRED = 'Props value id or password is required.',
}

export class LoginUseCase implements UseCase<ILoginUseCaseRequest, ILoginUseCaseResponse> {
	constructor(
		@Inject(USER_REPOSITORY)
		private readonly userRepository: IUserRepository,
	) {}

	async execute(request: ILoginUseCaseRequest): Promise<ILoginUseCaseResponse> {
		try {
			if (_.isEmpty(request.loginId) || _.isEmpty(request.password)) {
				return {
					code: LoginUseCaseCodes.PROPS_VALUES_ARE_REQUIRED,
				};
			}

			// NOTE: login id로 먼저 검사
			const userWithLoginId = await this.userRepository.findOne({
				loginId: request.loginId
			});

			if (!userWithLoginId) {
				return {
					code: LoginUseCaseCodes.WRONG_LOGIN_ID,
				};
			}

			if (!(await LoginUseCase.checkPassword(request.password, userWithLoginId))) {
				return {
					code: LoginUseCaseCodes.WRONG_PASSWORD,
				};
			}
			
			return {
				code: LoginUseCaseCodes.SUCCESS,
				user: userWithLoginId,
			};
		} catch {
			return {
				code: LoginUseCaseCodes.FAILURE,
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
