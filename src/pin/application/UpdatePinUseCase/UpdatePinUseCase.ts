import { Inject } from '@nestjs/common';

import { UseCase } from '../../../common/application/UseCase';
import { ImageUrl } from '../../../common/domain/Image/ImageUrl';
import { Pin } from '../../domain/Pin/Pin';
import { PinContent } from '../../domain/Pin/PinContent';
import { PinLocation } from '../../domain/Pin/PinLocation';
import { PinTitle } from '../../domain/Pin/PinTitle';
import { IPinRepository, PIN_REPOSITORY } from '../../infra/IPinRepository';
import { IUpdatePinUseCaseRequest } from './dto/IUpdatePinUseCaseRequest';
import { IUpdatePinUseCaseResponse } from './dto/IUpdatePinUseCaseResponse';


export enum UpdatePinUseCaseCodes {
	SUCCESS = 'SUCCESS',
	FAILURE = 'FAILURE',
	NOT_EXIST_PIN = 'Corresponding pin does not exist.',
}

export class UpdatePinUseCase implements UseCase<IUpdatePinUseCaseRequest, IUpdatePinUseCaseResponse> {
	constructor(
		@Inject(PIN_REPOSITORY)
		private readonly pinRepository: IPinRepository,
	) {}

	async execute(request: IUpdatePinUseCaseRequest): Promise<IUpdatePinUseCaseResponse> {
		try {
			const foundPin = await this.pinRepository.findOne(request.id);

			// NOTE: 업데이트 요청한 유저가 존재하지 않는 경우
			if (!foundPin) {
				return {
					code: UpdatePinUseCaseCodes.NOT_EXIST_PIN,
				};
			}

			if (!request.title) request.title = foundPin.title.value;
			if (!request.content) request.content = foundPin.content.value;
			if (!request.image) foundPin.image ? request.image = foundPin.image.value : request.image = null;
			
			const pin = Pin.create({
				title: PinTitle.create(request.title).value,
				content: PinContent.create(request.content).value,
				image: request.image ? ImageUrl.create(request.image).value : null,
				status: foundPin.status,
				location: PinLocation.create(foundPin.location.value).value,
				walkway: foundPin.walkway,
				user: foundPin.user,
				createdAt: foundPin.createdAt,
				updatedAt: new Date(),
			}, request.id).value;
			
			await this.pinRepository.save(pin);

			return {
				code: UpdatePinUseCaseCodes.SUCCESS,
				pin,
			};
		} catch {
			return {
				code: UpdatePinUseCaseCodes.FAILURE,
			};
		}
	}
}
