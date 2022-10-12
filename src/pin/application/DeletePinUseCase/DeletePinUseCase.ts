import { Inject } from '@nestjs/common';

import { UseCase } from '../../../common/application/UseCase';
import { ImageUrl } from '../../../common/domain/Image/ImageUrl';
import { Pin } from '../../domain/Pin/Pin';
import { PinContent } from '../../domain/Pin/PinContent';
import { PinLocation } from '../../domain/Pin/PinLocation';
import { PinStatus } from '../../domain/Pin/PinStatus';
import { PinTitle } from '../../domain/Pin/PinTitle';
import { PIN_REPOSITORY, IPinRepository } from '../../infra/IPinRepository';
import { IDeletePinUseCaseRequest } from './dto/IDeletePinUseCaseRequest';
import { IDeletePinUseCaseResponse } from './dto/IDeletePinUseCaseResponse';

export enum DeletePinUseCaseCodes {
	SUCCESS = 'SUCCESS',
	FAILURE = 'FAILURE',
	NOT_EXIST_PIN = 'Corresponding pin does not exist.',
}

export class DeletePinUseCase implements UseCase<IDeletePinUseCaseRequest, IDeletePinUseCaseResponse> {
	constructor(
		@Inject(PIN_REPOSITORY)
		private readonly pinRepository: IPinRepository,
	) {}

	async execute(request: IDeletePinUseCaseRequest): Promise<IDeletePinUseCaseResponse> {
		try {
			// NOTE: 업데이트 요청한 Pin가 존재하지 않는 경우
			const foundPin = await this.pinRepository.findOne(request.id);

			if (!foundPin) {
				return {
					code: DeletePinUseCaseCodes.NOT_EXIST_PIN,
				};
			}

			const pin = Pin.create({
				status: PinStatus.DELETE,
				title: PinTitle.create(foundPin.title.value).value,
				content: PinContent.create(foundPin.content.value).value,
				image: foundPin.image ? ImageUrl.create(foundPin.image.value).value : null,
				location: PinLocation.create(foundPin.location.value).value,
				walkway: foundPin.walkway,
				user: foundPin.user,
				createdAt: foundPin.createdAt,
				updatedAt: new Date(),
			}, request.id).value;
			
			await this.pinRepository.save(pin);

			return {
				code: DeletePinUseCaseCodes.SUCCESS,
			};
		} catch {
			return {
				code: DeletePinUseCaseCodes.FAILURE,
			};
		}
	}
}
