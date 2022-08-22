import { Inject } from "@nestjs/common";

import { UseCase } from "../../../common/application/UseCase";
import { Walk } from "../../domain/Walk/Walk";
import { WalkDistance } from "../../domain/Walk/WalkDistance";
import { WalkTime } from "../../domain/Walk/WalkTime";
import { IWalkRepository, WALK_REPOSITORY } from "../../infra/IWalkRepository";
import { ICreateWalkUseCaseRequest } from "./dto/CreateWalkUseCaseRequest";
import { ICreateWalkUseCaseResponse } from "./dto/CreateWalkUseCaseResponse";

export enum CreateWalkUseCaseCodes {
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
}

export class CreateWalkUseCase implements UseCase<ICreateWalkUseCaseRequest, ICreateWalkUseCaseResponse> {
    constructor(
        @Inject(WALK_REPOSITORY)
        private readonly walkRepository: IWalkRepository,
    ) {}

    async execute(request: ICreateWalkUseCaseRequest): Promise<ICreateWalkUseCaseResponse> {
        try {
            const walk = Walk.createNew({
                time: WalkTime.create(request.time).value,
                distance: WalkDistance.create(request.distance).value,
                finishStatus: request.finishStatus,
                walkway: request.walkway,
                user: request.user,
            }).value;

            await this.walkRepository.save(walk);

            return {
                code: CreateWalkUseCaseCodes.SUCCESS,
            };
        } catch {
            return {
                code: CreateWalkUseCaseCodes.FAILURE,
            };
        }
    }
}
