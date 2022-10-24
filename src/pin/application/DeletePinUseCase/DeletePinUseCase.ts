import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { UseCase } from '../../../common/application/UseCase';
import { ImageUrl } from '../../../common/domain/Image/ImageUrl';
import { Comment } from '../../domain/Comment/Comment';
import { CommentStatus, COMMENT_STATUS } from '../../domain/Comment/CommentStatus';
import { Pin } from '../../domain/Pin/Pin';
import { PinContent } from '../../domain/Pin/PinContent';
import { PinLocation } from '../../domain/Pin/PinLocation';
import { PinStatus } from '../../domain/Pin/PinStatus';
import { PinTitle } from '../../domain/Pin/PinTitle';
import { COMMENT_REPOSITORY, ICommentRepository } from '../../infra/ICommentRepository';
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
		@Inject(COMMENT_REPOSITORY)
		private readonly commentRepository: ICommentRepository,
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
			}, foundPin.id).value;

			const comments = await this.commentRepository.findAll({
				pinId: foundPin.id,
			});

			if (comments.items) {
				_.map(comments.items, (comment) => {
					Comment.create({
						content: comment.content,
						status: CommentStatus.DELETE as COMMENT_STATUS,
						pin: comment.pin,
						user: comment.user,
						createdAt: comment.createdAt,
						updatedAt: comment.updatedAt,
					}, comment.id).value;
				});
			}
			
			await this.pinRepository.save(pin);
			await this.commentRepository.updateAll(comments.items);

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
