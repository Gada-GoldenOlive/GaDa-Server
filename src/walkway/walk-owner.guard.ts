import { Injectable, CanActivate, ExecutionContext, HttpException } from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';

// TODO: 차후 GetWalkUseCase 구현 후 주석 해제
// import { GetWalkUseCase, GetWalkUseCaseCodes } from './application/GetWalkUseCase/GetWalkUseCase';

@Injectable()
export class WalkOwnerGuard implements CanActivate {
    constructor(
        // private readonly getWalkUseCase: GetWalkUseCase,
    ) {}

    async validateRequest(request): Promise<boolean> {
        // if (request.method === 'PATCH' || request.method === 'DELETE') {
        //     const getWalkUseCaseResponse = await this.getWalkUseCase.execute({
        //         id: request.params.walkId,
        //     });
            
        //     if (getWalkUseCaseResponse.code === GetWalkUseCaseCodes.NO_EXIST_WALK)
        //         throw new HttpException('NO EXIST WALK', StatusCodes.NOT_FOUND);

        //     if (getWalkUseCaseResponse.code !== GetWalkUseCaseCodes.SUCCESS) {
        //         throw new HttpException('FAIL TO FIND WALK', StatusCodes.INTERNAL_SERVER_ERROR);
        //     }
        //     if (getWalkUseCaseResponse.walk.user.id !== request.user.id)
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
