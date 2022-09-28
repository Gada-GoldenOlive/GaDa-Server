import { Injectable, CanActivate, ExecutionContext, HttpException } from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';

// TODO: 차후 GetFriendUseCase 구현 후 주석 해제
// import { GetFriendUseCase, GetFriendUseCaseCodes } from './application/GetFriendUseCase/IGetFriendUseCase';

@Injectable()
export class FriendOwnerGuard implements CanActivate {
    constructor(
        // private readonly getFriendUseCase: GetFriendUseCase,
    ) {}

    async validateRequest(request): Promise<boolean> {
        // if (request.method === 'PATCH' || request.method === 'DELETE') {
        //     const getFriendUseCaseResponse = await this.getFriendUseCase.execute({
        //         id: request.params.friendId,
        //     });
            
        //     if (getFriendUseCaseResponse.code === GetFriendUseCaseCodes.NO_EXIST_FRIEND)
        //         throw new HttpException('NO EXIST FRIEND', StatusCodes.NOT_FOUND);

        //     if (getFriendUseCaseResponse.code !== GetFriendUseCaseCodes.SUCCESS) {
        //         throw new HttpException('FAIL TO FIND FRIEND', StatusCodes.INTERNAL_SERVER_ERROR);
        //     }
        //     if (getFriendUseCaseResponse.friend.walk.user.id !== request.user.id)
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
