import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';

import { CommonResponse } from '../../common/controller/dto/CommonResponse';
import { CreateWalkwayRequest, UpdateWalkwayRequest } from './dto/WalkwayRequest';
import { GetAllNearWalkwayResponse, GetWalkwayResponse } from './dto/WalkwayResponse';

@Controller('walkway')
@ApiTags('산책로')
export class WalkwayController {
    constructor() {}

    @Post()
    @ApiCreatedResponse({
        type: CommonResponse,
    })
    async create(
        @Body() request: CreateWalkwayRequest,
    ) {}

    @Get('/:lat/:lng')
    @ApiOkResponse({
        type: GetAllNearWalkwayResponse,
    })
    async getAllNear() {}

    @Get('/walkwayId')
    @ApiOkResponse({
        type: GetWalkwayResponse,
    })
    async getWalkway() {}

    @Patch('/:walkwayId')
    @ApiResponse({
        type: CommonResponse,
    })
    async update(
        @Body() request: UpdateWalkwayRequest,
    ): Promise<CommonResponse> {
        return {
            code: StatusCodes.NO_CONTENT,
            responseMessage: 'SUCCESS TO UPDATE WALKWAY',
        }
    }

    @Delete(':walkwayId')
    @ApiResponse({
        type: CommonResponse,
    })
    async delete() {}
}
