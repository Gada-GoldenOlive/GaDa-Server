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
            const result = await this.commentRepository.findAll({
                user: request.user,
                pinId: request.pinId,
                paginationOptions: request.paginationOptions,
            });

            return {
                code: GetAllCommentUseCaseCodes.SUCCESS,
                comments: result.items,
                meta: result.meta,
                links: result.links,
            };
        } catch {
            return {
                code: GetAllCommentUseCaseCodes.FAILURE,
            };
        }
    }
}
