import { Injectable, CanActivate, ExecutionContext, HttpException } from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';

import { GetReviewUseCase, GetReviewUseCaseCodes } from './application/GetReviewUseCase/IGetReviewUseCase';

@Injectable()
export class ReviewOwnerGuard implements CanActivate {
    constructor(
        private readonly getReviewUseCase: GetReviewUseCase,
    ) {}

    async validateRequest(request): Promise<boolean> {
        if (request.method === 'PATCH' || request.method === 'DELETE') {
            const getReviewUseCaseResponse = await this.getReviewUseCase.execute({
                id: request.params.reviewId,
            });

            if (getReviewUseCaseResponse.code === GetReviewUseCaseCodes.NO_EXIST_REVIEW)
                throw new HttpException('NO EXIST REVIEW', StatusCodes.NOT_FOUND);

            if (getReviewUseCaseResponse.code !== GetReviewUseCaseCodes.SUCCESS) {
                throw new HttpException('FAIL TO FIND REVIEW', StatusCodes.INTERNAL_SERVER_ERROR);
            }
            if (getReviewUseCaseResponse.review.walk.user.id !== request.user.id)
                return false;
        }
        return true;
    }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        return await this.validateRequest(request);
    }
}
