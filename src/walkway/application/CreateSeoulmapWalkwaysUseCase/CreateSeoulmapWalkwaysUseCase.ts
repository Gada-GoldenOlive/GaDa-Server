import _ from "lodash";
import { Inject } from "@nestjs/common";

import { UseCase } from "../../../common/application/UseCase";
import { Walkway } from "../../domain/Walkway/Walkway";
import { WalkwayAddress } from "../../domain/Walkway/WalkwayAddress";
import { WalkwayDistance } from "../../domain/Walkway/WalkwayDistance";
import { WalkwayEndPoint } from "../../domain/Walkway/WalkwayEndPoint";
import { WalkwayPath } from "../../domain/Walkway/WalkwayPath";
import { WalkwayStartPoint } from "../../domain/Walkway/WalkwayStartPoint";
import { WalkwayTime } from "../../domain/Walkway/WalkwayTime";
import { WalkwayTitle } from "../../domain/Walkway/WalkwayTitle";
import { IWalkwayRepository, WALKWAY_REPOSITORY } from "../../infra/IWalkwayRepository";
import { ICreateSeoulmapWalkwaysUseCaseRequest } from "./dto/CreateSeoulmapWalkwaysUseCaseRequest";
import { ICreateSeoulmapWalkwaysUseCaseResponse } from "./dto/CreateSeoulmapWalkwaysUseCaseResponse";
import { ImageUrl } from "../../../common/domain/Image/ImageUrl";

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
                    endPoint: WalkwayEndPoint.create(walkway.path[walkway.path.length - 1]).value,
                    user: walkway.user,
                    image: ImageUrl.create(walkway.image).value,
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
