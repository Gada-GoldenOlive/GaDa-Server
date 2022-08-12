import { Inject } from "@nestjs/common";
import _ from "lodash";

import { UseCase } from "../../../common/application/UseCase";
import { User } from "../../../user/domain/User";
import { Walkway } from "../../domain/Walkway/Walkway";
import { WalkwayAddress } from "../../domain/Walkway/WalkwayAddress";
import { WalkwayDistance } from "../../domain/Walkway/WalkwayDistance";
import { WalkwayPath } from "../../domain/Walkway/WalkwayPath";
import { WalkwayStartPoint } from "../../domain/Walkway/WalkwayStartPoint";
import { WalkwayTime } from "../../domain/Walkway/WalkwayTime";
import { WalkwayTitle } from "../../domain/Walkway/WalkwayTitle";
import { IWalkwayRepository, WALKWAY_REPOSITORY } from "../../infra/IWalkwayRepository";
import { ICreateSeoulmapWalkwaysUseCaseRequest } from "./dto/CreateSeoulmapWalkwaysUseCaseRequest";
import { ICreateSeoulmapWalkwaysUseCaseResponse } from "./dto/CreateSeoulmapWalkwaysUseCaseResponse";

export enum CreateSeoulmapWalkwaysUseCaseCodes {
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
}

export class CreateSeoulmapWalkwaysUseCase implements UseCase<ICreateSeoulmapWalkwaysUseCaseRequest, ICreateSeoulmapWalkwaysUseCaseResponse> {
    constructor(
        @Inject(WALKWAY_REPOSITORY)
        private readonly walkwayRespository: IWalkwayRepository,
    ) {}

    async execute(request?: ICreateSeoulmapWalkwaysUseCaseRequest): Promise<ICreateSeoulmapWalkwaysUseCaseResponse> {
        try {
            let walkways = _.map(request.values, (walkway => {
                return Walkway.createNew({
                    title: WalkwayTitle.create(walkway.title).value,
                    address: WalkwayAddress.create(walkway.address).value,
                    distance: WalkwayDistance.create(walkway.distance).value,
                    time: WalkwayTime.create(walkway.time).value,
                    path: WalkwayPath.create(walkway.path).value,
                    startPoint: WalkwayStartPoint.create(walkway.path[0]).value,
                    user: walkway.user,
                }).value;
            }));
            await this.walkwayRespository.saveAll(walkways);

            return {
                code: CreateSeoulmapWalkwaysUseCaseCodes.SUCCESS,
            };
        } catch {
            return {
                code: CreateSeoulmapWalkwaysUseCaseCodes.FAILURE,
            };
        }
    }
}
