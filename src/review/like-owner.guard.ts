import { Injectable, CanActivate, ExecutionContext, HttpException } from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';

import { GetLikeUseCase, GetLikeUseCaseCodes } from './application/GetLikeUseCase/IGetLikeUseCase';

@Injectable()
export class LikeOwnerGuard implements CanActivate {
    constructor(
        private readonly getLikeUseCase: GetLikeUseCase,
    ) {}

    async validateRequest(request): Promise<boolean> {
        // TODO: 차후 GetLikeUseCase에 likeId로 찾는 기능 구현 후 주석 해제
        // if (request.method === 'PATCH' || request.method === 'DELETE') {
        //     const getLikeUseCaseResponse = await this.getLikeUseCase.execute({
        //         id: request.params.likeId,
        //     });

        //     if (getLikeUseCaseResponse.code !== GetLikeUseCaseCodes.SUCCESS) {
        //         throw new HttpException('FAIL TO FIND LIKE', StatusCodes.INTERNAL_SERVER_ERROR);
        //     }
        //     if (getLikeUseCaseResponse.like.user.id !== request.user.id)
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
