import { Inject } from '@nestjs/common';

import { UseCase } from '../../../common/application/UseCase';
import { ImageUrl } from '../../../common/domain/Image/ImageUrl';
import { Walkway } from '../../domain/Walkway/Walkway';
import { WalkwayAddress } from '../../domain/Walkway/WalkwayAddress';
import { WalkwayDistance } from '../../domain/Walkway/WalkwayDistance';
import { WalkwayEndPoint } from '../../domain/Walkway/WalkwayEndPoint';
import { WalkwayPath } from '../../domain/Walkway/WalkwayPath';
import { WalkwayStartPoint } from '../../domain/Walkway/WalkwayStartPoint';
import { WalkwayTime } from '../../domain/Walkway/WalkwayTime';
import { WalkwayTitle } from '../../domain/Walkway/WalkwayTitle';
import { IWalkwayRepository, WALKWAY_REPOSITORY } from '../../infra/IWalkwayRepository';
import { ICreateWalkwayUseCaseResponse } from './dto/CreateWalkwaysUseCaseResponse';
import { ICreateWalkwayUseCaseRequest } from './dto/CreateWalkwayUseCaseRequest';

export enum CreateWalkwayUseCaseCodes {
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
}

export class CreateWalkwayUseCase implements UseCase<ICreateWalkwayUseCaseRequest, ICreateWalkwayUseCaseResponse> {
    constructor(
        @Inject(WALKWAY_REPOSITORY)
        private readonly walkwayRespository: IWalkwayRepository,
    ) {}

    async execute(request?: ICreateWalkwayUseCaseRequest): Promise<ICreateWalkwayUseCaseResponse> {
        try {
            const walkway = Walkway.createNew({
                title: WalkwayTitle.create(request.title).value,
                address: WalkwayAddress.create(request.address).value,
                distance: WalkwayDistance.create(request.distance).value,
                time: WalkwayTime.create(request.time).value,
                path: WalkwayPath.create(request.path).value,
                startPoint: WalkwayStartPoint.create(request.path[0]).value,
                endPoint: WalkwayEndPoint.create(request.path[request.path.length - 1]).value,
                user: request.user,
                image: request.image ? ImageUrl.create(request.image).value : null,
            }).value;
            await this.walkwayRespository.save(walkway);

            return {
                code: CreateWalkwayUseCaseCodes.SUCCESS,
            };
        } catch {
            return {
                code: CreateWalkwayUseCaseCodes.FAILURE,
            };
        }
    }
}
