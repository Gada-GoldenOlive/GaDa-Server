import { Inject } from "@nestjs/common";

import { UseCase } from "../../../common/application/UseCase";
import { Friend } from "../../domain/Friend/Friend";
import { FRIEND_REPOSITORY, IFriendRepository } from "../../infra/IFriendRepository";
import { ICreateFriendUseCaseRequest } from "./dto/CreateFriendUseCaseRequest";
import { ICreateFriendUseCaseResponse } from "./dto/CreateFriendUseCaseResponse";

export enum CreateFriendUseCaseCodes {
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
}

export class CreateFriendUseCase implements UseCase<ICreateFriendUseCaseRequest, ICreateFriendUseCaseResponse> {
    constructor(
        @Inject(FRIEND_REPOSITORY)
        private readonly friendRepository: IFriendRepository,
    ) {}

    async execute(request: ICreateFriendUseCaseRequest): Promise<ICreateFriendUseCaseResponse> {
        try {
            const friend = Friend.createNew({
                user1: request.user,
                user2: request.friend,
            }).value;

            await this.friendRepository.save(friend);

            return {
                code: CreateFriendUseCaseCodes.SUCCESS,
            };
        } catch {
            return {
                code: CreateFriendUseCaseCodes.FAILURE,
            };
        }
    }
}
