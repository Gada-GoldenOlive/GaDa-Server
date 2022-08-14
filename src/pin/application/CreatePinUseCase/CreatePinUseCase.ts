import _ from 'lodash';
import { Inject, Logger } from '@nestjs/common';

import { UseCase } from '../../../common/application/UseCase';
import { ImageUrl } from '../../../common/domain/Image/ImageUrl';
import { Pin } from '../../domain/Pin';
import { PinContent } from '../../domain/PinContent';
import { PinLocation } from '../../domain/PinLocation';
import { PinTitle } from '../../domain/PinTitle';
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
			}
		} catch (e) {
			return {
				code: CreatePinUseCaseCodes.FAILURE,
			};
		}
	}
}