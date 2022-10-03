import { Injectable, CanActivate, ExecutionContext, HttpException } from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';

// TODO: 차후 GetAchieveUseCase 구현 후 주석 해제
// import { GetAchieveUseCase, GetAchieveUseCaseCodes } from './application/GetAchieveUseCase/GetAchieveUseCase';

@Injectable()
export class AchieveOwnerGuard implements CanActivate {
    constructor(
        // private readonly getAchieveUseCase: GetAchieveUseCase,
    ) {}

    async validateRequest(request): Promise<boolean> {
        // if (request.method === 'PATCH' || request.method === 'DELETE') {
        //     const getAchieveUseCaseResponse = await this.getAchieveUseCase.execute({
        //         id: request.params.achieveId,
        //     });

        //     if (getAchieveUseCaseResponse.code === GetAchieveUseCaseCodes.NO_ACHIEVE_FOUND_ERROR)
        //         throw new HttpException('NO EXIST ACHIEVE', StatusCodes.NOT_FOUND);

        //     if (getAchieveUseCaseResponse.code !== GetAchieveUseCaseCodes.SUCCESS) {
        //         throw new HttpException('FAIL TO FIND ACHIEVE', StatusCodes.INTERNAL_SERVER_ERROR);
        //     }
        //     if (getAchieveUseCaseResponse.achieve.user.id !== request.user.id)
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
