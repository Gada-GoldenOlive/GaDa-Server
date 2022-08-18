import { Inject } from '@nestjs/common';

import { UseCase } from '../../../common/application/UseCase';
import { IPinRepository, PIN_REPOSITORY } from '../../infra/IPinRepository';
import { IGetPinUseCaseRequest } from './dto/IGetPinUseCaseRequest';
import { IGetPinUseCaseResponse } from './dto/IGetPinUseCaseResponse';

export enum GetPinUseCaseCodes {
	SUCCESS = 'SUCCESS',
	FAILURE = 'FAILURE',
	NO_PIN_FOUND_ERROR = 'Corresponding pin does not exist.',
}

export class GetPinUseCase implements UseCase<IGetPinUseCaseRequest, IGetPinUseCaseResponse> {
	constructor(
		@Inject(PIN_REPOSITORY)
		private readonly pinRepository: IPinRepository,
	) {}

	async execute(request: IGetPinUseCaseRequest): Promise<IGetPinUseCaseResponse> {
		try {
			const pin = await this.pinRepository.findOne(request.id);

			if (!pin) {
				return {
					code: GetPinUseCaseCodes.NO_PIN_FOUND_ERROR,
				};
			}

			return {
				code: GetPinUseCaseCodes.SUCCESS,
				pin,
			};
		} catch {
			return {
				code: GetPinUseCaseCodes.FAILURE,
			};
		}
	}
}
