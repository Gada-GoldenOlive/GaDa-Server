import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class UserOwnerGuard implements CanActivate {
    validateRequest(request): boolean {
        if (request.method === 'PATCH' || request.method === 'DELETE') {
            if (request.params.userId !== request.user.id)
                return false;
        }
        return true;
    }

    canActivate(
        context: ExecutionContext,
    ): boolean {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }
}
