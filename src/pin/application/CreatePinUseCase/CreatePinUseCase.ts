import { Inject, Logger } from '@nestjs/common';
import _ from 'lodash';
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
			let content: string = request.content;
			if (_.isNil(request.content)) content = '';

			let image: string = request.image;
			if (_.isNil(request.image)) image = '';
			
			const pin = Pin.createNew({
				title: PinTitle.create(request.title).value,
				content: PinContent.create(content).value,
				image: ImageUrl.create(request.image).value,
				location: PinLocation.create(request.location).value,
				walkway: request.walkway,
				user: request.user,
			}).value;

			await this.pinRepository.save(pin);

			return {
				code: CreatePinUseCaseCodes.SUCCESS,
			}
		} catch (e) {
			Logger.error(e);
			return {
				code: CreatePinUseCaseCodes.FAILURE,
			};
		}
	}
}