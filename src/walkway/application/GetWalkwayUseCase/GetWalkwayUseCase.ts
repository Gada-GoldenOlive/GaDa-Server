import { Inject } from "@nestjs/common";
import _ from "lodash";

import { UseCase } from "../../../common/application/UseCase";
import { IWalkwayRepository, WALKWAY_REPOSITORY } from "../../infra/IWalkwayRepository";
import { IGetWalkwayUseCaseResponse } from "./dto/GetWalkwayResponse";
import { IGetWalkwayUseCaseRequest } from "./dto/GetWalkwayUseCaseRequest";

export enum GetWalkwayUseCaseCodes {
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
}

export class GetWalkwayUseCase implements UseCase<
IGetWalkwayUseCaseRequest, IGetWalkwayUseCaseResponse> {
    constructor(
        @Inject(WALKWAY_REPOSITORY)
        private readonly walkwayRepository: IWalkwayRepository,
    ) {}

    async execute(request?: IGetWalkwayUseCaseRequest): Promise<IGetWalkwayUseCaseResponse> {
        try {
            if (_.isNil(request.id)) return null;
            
            const walkway = await this.walkwayRepository.findOne(request.id);

            return {
                code: GetWalkwayUseCaseCodes.SUCCESS,
                walkway,
                
            };
        } catch {
            return {
                code: GetWalkwayUseCaseCodes.FAILURE,
            };
        }
    }
}
