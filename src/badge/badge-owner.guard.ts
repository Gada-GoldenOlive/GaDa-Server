import { Injectable, CanActivate, ExecutionContext, HttpException } from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';

// TODO: 차후 GetBadgeUseCase 구현 후 주석 해제
// import { GetBadgeUseCaseCodes } from './application/GetBadgeUseCase/GetBadgeUseCase';

@Injectable()
export class BadgeOwnerGuard implements CanActivate {
    constructor(
        // private readonly getBadgeUseCase: GetBadgeUseCase,
    ) {}

    async validateRequest(request): Promise<boolean> {
        // if (request.method === 'PATCH' || request.method === 'DELETE') {
        //     const getBadgeUseCaseResponse = await this.getBadgeUseCase.execute({
        //         id: request.params.badgeId,
        //     });

        //     if (getBadgeUseCaseResponse.code === GetBadgeUseCaseCodes.NO_EXIST_BADGE)
        //         throw new HttpException('NO EXIST BADGE', StatusCodes.NOT_FOUND);

        //     if (getBadgeUseCaseResponse.code !== GetBadgeUseCaseCodes.SUCCESS) {
        //         throw new HttpException('FAIL TO FIND BADGE', StatusCodes.INTERNAL_SERVER_ERROR);
        //     }
        //         if (getBadgeUseCaseResponse.badge.user.id !== request.user.id)
        //             return false;
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
