import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { UseCase } from '../../../common/application/UseCase';
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

			// NOTE: id를 가진 회원이 존재할 때 비밀번호도 넣어서 함께 검사
			const user = await this.userRepository.findOne(request);

			if (!user) {
				return {
					code: LoginUseCaseCodes.WRONG_PASSWORD,
				};
			}
			
			return {
				code: LoginUseCaseCodes.SUCCESS,
				user,
			};
		} catch {
			return {
				code: LoginUseCaseCodes.FAILURE,
			};
		}
	}
}
