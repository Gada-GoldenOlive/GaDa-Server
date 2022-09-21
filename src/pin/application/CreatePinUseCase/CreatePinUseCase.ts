import { Inject } from '@nestjs/common';

import { UseCase } from '../../../common/application/UseCase';
import { ImageUrl } from '../../../common/domain/Image/ImageUrl';
import { Pin } from '../../domain/Pin/Pin';
import { PinContent } from '../../domain/Pin/PinContent';
import { PinLocation } from '../../domain/Pin/PinLocation';
import { PinTitle } from '../../domain/Pin/PinTitle';
import { IPinRepository, PIN_REPOSITORY } from '../../infra/IPinRepository';
import { ICreatePinUseCaseRequest } from './dto/ICreatePinUseCaseRequest';
import { ICreatePinUseCaseResponse } from './dto/ICreatePinUseCaseResponse';

export enum CreatePinUseCaseCodes {
	SUCCESS = 'SUCCESS',
	FAILURE = 'FAILURE',
}

export class CreatePinUseCase implements UseCase<ICreatePinUseCaseRequest, ICreatePinUseCaseResponse> {
	constructor(
		@Inject(PIN_REPOSITORY)
		private readonly pinRepository: IPinRepository,
	) {}

	async execute(request: ICreatePinUseCaseRequest): Promise<ICreatePinUseCaseResponse> {
		try {
			const pin = Pin.createNew({
				title: PinTitle.create(request.title).value,
				content: request.content ? PinContent.create(request.content).value : PinContent.create(' ').value,
				image: request.image ? ImageUrl.create(request.image).value : null,
				location: PinLocation.create(request.location).value,
				walkway: request.walkway,
				user: request.user,
			}).value;

			await this.pinRepository.save(pin);

			return {
				code: CreatePinUseCaseCodes.SUCCESS,
			};
		} catch {
			return {
				code: CreatePinUseCaseCodes.FAILURE,
			};
		}
	}
}
