import { Inject, Logger } from '@nestjs/common';
import _ from 'lodash';

import { UseCase } from '../../../common/application/UseCase';
import { IUserRepository, USER_REPOSITORY } from '../../infra/IUserRepository';
import { ILoginUseCaseRequest } from './dto/ILoginUseCaserequest';
import { ILoginUseCaseResponse } from './dto/ILoginUseCaseResponse';

export enum LoginUseCaseCodes {
	SUCCESS= 'SUCCESS',
	FAILURE = 'FAILURE',
	NO_MATCH_USER_ERROR = 'User with requested ID or password does not exist.',
}

export class LoginUseCase implements UseCase<ILoginUseCaseRequest, ILoginUseCaseResponse> {
	constructor(
		@Inject(USER_REPOSITORY)
		private readonly userRepository: IUserRepository,
	) {}

	async execute(request: ILoginUseCaseRequest): Promise<ILoginUseCaseResponse> {
		try {
			if (_.isEmpty(request.userId) || _.isEmpty(request.password)) {
				return {
					code: LoginUseCaseCodes.FAILURE,
					user: null,
				}
			}

			const user = await this.userRepository.findOne(request);

			if (!user) {
				return {
					code: LoginUseCaseCodes.FAILURE,
					user: null,
				}
			}

			return {
				code: LoginUseCaseCodes.SUCCESS,
				user,
			};
		} catch {
			return {
				code: LoginUseCaseCodes.FAILURE,
			}
		}
	}
}
