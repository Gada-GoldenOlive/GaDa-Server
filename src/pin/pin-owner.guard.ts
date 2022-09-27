import { Injectable, CanActivate, ExecutionContext, HttpException } from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';

import { GetPinUseCase, GetPinUseCaseCodes } from './application/GetPinUseCase/GetPinUseCase';

@Injectable()
export class PinOwnerGuard implements CanActivate {
    constructor(
        private readonly getPinUseCase: GetPinUseCase,
    ) {}

    async validateRequest(request): Promise<boolean> {
        if (request.method === 'PATCH' || request.method === 'DELETE') {
            const getPinUseCaseResponse = await this.getPinUseCase.execute({
                id: request.params.pinId,
            });

            if (getPinUseCaseResponse.code === GetPinUseCaseCodes.NO_PIN_FOUND_ERROR)
                throw new HttpException('NO EXIST PIN', StatusCodes.NOT_FOUND);

            if (getPinUseCaseResponse.code !== GetPinUseCaseCodes.SUCCESS) {
                throw new HttpException('FAIL TO FIND PIN', StatusCodes.INTERNAL_SERVER_ERROR);
            }
            if (getPinUseCaseResponse.pin.user.id !== request.user.id)
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
