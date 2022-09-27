import { Injectable, CanActivate, ExecutionContext, HttpException } from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';

// TODO: 차후 GetCommentUseCase 구현 후 주석 해제
// import { GetCommentUseCase, GetCommentUseCaseCodes } from './application/GetCommentUseCase/GetCommentUseCase';

@Injectable()
export class CommentOwnerGuard implements CanActivate {
    constructor(
        // private readonly getCommentUseCase: GetCommentUseCase,
    ) {}

    async validateRequest(request): Promise<boolean> {
        // if (request.method === 'PATCH' || request.method === 'DELETE') {
        //     const getCommentUseCaseResponse = await this.getCommentUseCase.execute({
        //         id: request.params.commentId,
        //     });

        //     if (getCommentUseCaseResponse.code === GetCommentUseCaseCodes.NO_COMMENT_FOUND_ERROR)
        //         throw new HttpException('NO EXIST COMMENT', StatusCodes.NOT_FOUND);

        //     if (getCommentUseCaseResponse.code !== GetCommentUseCaseCodes.SUCCESS) {
        //         throw new HttpException('FAIL TO FIND COMMENT', StatusCodes.INTERNAL_SERVER_ERROR);
        //     }
        //     if (getCommentUseCaseResponse.comment.user.id !== request.user.id)
        //         return false;
        // }
        return true;
    }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        return await this.validateRequest(request);
    }
}
