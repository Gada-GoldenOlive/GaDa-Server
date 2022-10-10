import { Injectable, CanActivate, ExecutionContext, HttpException } from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';

import { GetWalkwayUseCase, GetWalkwayUseCaseCodes } from './application/GetWalkwayUseCase/GetWalkwayUseCase';

@Injectable()
export class WalkwayOwnerGuard implements CanActivate {
    constructor(
        private readonly getWalkwayUseCase: GetWalkwayUseCase,
    ) {}

    async validateRequest(request): Promise<boolean> {
        if (request.method === 'PATCH' || request.method === 'DELETE') {
            const getWalkwayUseCaseResponse = await this.getWalkwayUseCase.execute({
                id: request.params.walkwayId,
            });
            
            if (getWalkwayUseCaseResponse.code === GetWalkwayUseCaseCodes.NOT_EXIST_WALKWAY)
                throw new HttpException('NO EXIST WALKWAY', StatusCodes.NOT_FOUND);

            if (getWalkwayUseCaseResponse.code !== GetWalkwayUseCaseCodes.SUCCESS) {
                throw new HttpException('FAIL TO FIND WALKWAY', StatusCodes.INTERNAL_SERVER_ERROR);
            }
            if (!getWalkwayUseCaseResponse.walkway.user)
                return false;
            if (getWalkwayUseCaseResponse.walkway.user.id !== request.user.id)
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
