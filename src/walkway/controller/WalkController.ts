import { Body, Controller, Delete, Get, Patch, Post } from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiResponse, ApiTags } from "@nestjs/swagger";
import { StatusCodes } from "http-status-codes";
import { CommonResponse } from "../../common/controller/dto/CommonResponse";
import { CreateWalkRequest, UpdateWalkRequest } from "./dto/WalkRequest";
import { GetAllWalkResponse } from "./dto/WalkResponse";

@Controller('walk')
@ApiTags('산책')
export class WalkController {
    constructor() {}

    @Post()
    @ApiCreatedResponse({
        type: CommonResponse,
    })
    async create(
        @Body() request: CreateWalkRequest,
    ) {}

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