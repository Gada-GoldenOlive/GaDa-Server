import { Inject } from '@nestjs/common';

import { UseCase } from '../../../common/application/UseCase';
import { Comment } from '../../domain/Comment/Comment';
import { CommentContent } from '../../domain/Comment/CommentContent';
import { CommentStatus } from '../../domain/Comment/CommentStatus';
import { COMMENT_REPOSITORY, ICommentRepository } from '../../infra/ICommentRepository';
import { IDeleteCommentUseCaseRequest } from './dto/IDeleteCommentUseCaseRequest';
import { IDeleteCommentUseCaseResponse } from './dto/IDeleteCommentUseCaseResponse';

export enum DeleteCommentUseCaseCodes {
	SUCCESS = 'SUCCESS',
	FAILURE = 'FAILURE',
	NOT_EXIST_COMMENT = 'Corresponding comment does not exist.',
}

export class DeleteCommentUseCase implements UseCase<IDeleteCommentUseCaseRequest, IDeleteCommentUseCaseResponse> {
	constructor(
		@Inject(COMMENT_REPOSITORY)
		private readonly commentRepository: ICommentRepository,
	) {}

	async execute(request: IDeleteCommentUseCaseRequest): Promise<IDeleteCommentUseCaseResponse> {
		try {
			// NOTE: 업데이트 요청한 Comment가 존재하지 않는 경우
			const foundComment = await this.commentRepository.findOne(request.id);

			if (!foundComment) {
				return {
					code: DeleteCommentUseCaseCodes.NOT_EXIST_COMMENT,
				};
			}

			const comment = Comment.create({
				content: CommentContent.create(foundComment.content.value).value,
				status: CommentStatus.DELETE,
				pin: foundComment.pin,
				user: foundComment.user,
				createdAt: foundComment.createdAt,
				updatedAt: new Date(),
			}, request.id).value;

			await this.commentRepository.save(comment);

			return {
				code: DeleteCommentUseCaseCodes.SUCCESS,
			};
		} catch {
			return {
				code: DeleteCommentUseCaseCodes.FAILURE,
			};
		}
	}
}
