import { Body, Controller, Delete, Get, HttpCode, HttpException, Patch, Post } from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiResponse, ApiTags } from "@nestjs/swagger";
import { StatusCodes } from "http-status-codes";

import { CommonResponse } from "../../common/controller/dto/CommonResponse";
import { GetUserUseCase, GetUserUseCaseCodes } from "../../user/application/GetUserUseCase/GetUserUseCase";
import { CreateWalkUseCase, CreateWalkUseCaseCodes } from "../application/CreateWalkUseCase/CreateWalkUseCase";
import { GetWalkwayUseCase, GetWalkwayUseCaseCodes } from "../application/GetWalkwayUseCase/GetWalkwayUseCase";
import { CreateWalkRequest, UpdateWalkRequest } from "./dto/WalkRequest";
import { GetAllWalkResponse } from "./dto/WalkResponse";

@Controller('walks')
@ApiTags('산책')
export class WalkController {
    constructor(
        private readonly createWalkUseCase: CreateWalkUseCase,
        private readonly getUserUseCase: GetUserUseCase,
        private readonly getWalkwayUseCase: GetWalkwayUseCase,
    ) {}

    @Post()
    @HttpCode(StatusCodes.CREATED)
    @ApiCreatedResponse({
        type: CommonResponse,
    })
    async create(
        @Body() request: CreateWalkRequest,
    ): Promise<CommonResponse> {
        const [ walkwayResponse, userResponse ] = await Promise.all([
            this.getWalkwayUseCase.execute({
                id: request.walkwayId,
            }),
            this.getUserUseCase.execute({
                id: request.userId,
            }),
        ]);

        if (walkwayResponse.code !== GetWalkwayUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO CREATE WALK BY WALKWAY', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        if (userResponse.code !== GetUserUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO CREATE WALK BY USER', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const createWalkUseCaseResponse = await this.createWalkUseCase.execute({
            time: request.time,
            distance: request.distance,
            finishStatus: request.finishStatus,
            user: userResponse.user,
            walkway: walkwayResponse.walkway,
        })

        if (createWalkUseCaseResponse.code != CreateWalkUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO CREATE WALK', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        return {
            code: StatusCodes.CREATED,
            responseMessage: 'SUCCESS TO CREATE WALK',
        }
    }

    @Get()
    @ApiOkResponse({
        type: GetAllWalkResponse,
    })
    async getAll() {}

    @Patch('/:walkId')
    @ApiResponse({
        type: CommonResponse,
    })
    async update(
        @Body() request: UpdateWalkRequest,
    ): Promise<CommonResponse> {
        return {
            code: StatusCodes.NO_CONTENT,
            responseMessage: 'SUCCESS TO UPDATE WALK'
        }
    }

    @Delete('/:walkId')
    @ApiResponse({
        type: CommonResponse,
    })
    async delete() {}
}
