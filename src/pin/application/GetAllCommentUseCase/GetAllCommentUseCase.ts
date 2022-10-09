import { Inject } from '@nestjs/common';

import { UseCase } from '../../../common/application/UseCase';
import { ICommentRepository, COMMENT_REPOSITORY } from '../../infra/ICommentRepository';
import { IGetAllCommentUseCaseRequest } from './dto/IGetAllCommentUseCaseRequest';
import { IGetAllCommentUseCaseResponse } from './dto/IGetAllCommentUseCaseResponse';

export enum GetAllCommentUseCaseCodes {
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
}

export class GetAllCommentUseCase implements UseCase<IGetAllCommentUseCaseRequest, IGetAllCommentUseCaseResponse> {
    constructor(
        @Inject(COMMENT_REPOSITORY)
        private readonly commentRepository: ICommentRepository,
    ) {}

    async execute(request: IGetAllCommentUseCaseRequest): Promise<IGetAllCommentUseCaseResponse> {
        try {
            const comments = await this.commentRepository.findAll(request.pinId);

            return {
                code: GetAllCommentUseCaseCodes.SUCCESS,
                comments,
            };
        } catch {
            return {
                code: GetAllCommentUseCaseCodes.FAILURE,
            };
        }
    }
}
