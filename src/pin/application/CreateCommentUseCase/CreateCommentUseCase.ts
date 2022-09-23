import { Inject } from '@nestjs/common';

import { UseCase } from '../../../common/application/UseCase';
import { Comment } from '../../domain/Comment/Comment';
import { CommentContent } from '../../domain/Comment/CommentContent';
import { ICommentRepository, COMMENT_REPOSITORY } from '../../infra/ICommentRepository';
import { ICreateCommentUseCaseRequest } from './dto/ICreateCommentUseCaseRequest';
import { ICreateCommentUseCaseResponse } from './dto/ICreateCommentUseCaseResponse';

export enum CreateCommentUseCaseCodes {
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
}

export class CreateCommentUseCase implements UseCase<ICreateCommentUseCaseRequest, ICreateCommentUseCaseResponse> {
    constructor(
        @Inject(COMMENT_REPOSITORY)
        private readonly commentRepository: ICommentRepository,
    ) {}

    async execute(request: ICreateCommentUseCaseRequest): Promise<ICreateCommentUseCaseResponse> {
        try {
            const comment = Comment.createNew({
                content: CommentContent.create(request.content).value,
                pin: request.pin,
                user: request.user,
            }).value;

            await this.commentRepository.save(comment);

            return {
                code: CreateCommentUseCaseCodes.SUCCESS,
            };
        } catch {
            return {
                code: CreateCommentUseCaseCodes.FAILURE,
            };
        }
    }
}
