import _ from 'lodash';
import { StatusCodes } from 'http-status-codes';
import { Body, Controller, Delete, Get, HttpCode, HttpException, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CommonResponse } from '../../common/controller/dto/CommonResponse';
import { CreatePinRequest, UpdatePinRequest } from './dto/PinRequest';
import { GetAllPinResponse } from './dto/PinResponse';
import { GetAllPinUseCase, GetAllPinUseCaseCodes } from '../application/GetAllPinUseCase/GetAllPinUseCase';
import { GetUserUseCase } from '../../user/application/GetUserUseCase/GetUserUseCase';
import { GetWalkwayUseCase } from '../../walkway/application/GetWalkwayUseCase/GetWalkwayUseCase';
import { IGetAllPinUseCaseResponse } from '../application/GetAllPinUseCase/dto/IGetAllPinUseCaseResponse';

@Controller('pin')
@ApiTags('핀')
export class PinController {
    constructor(
        private readonly getAllPinUseCase: GetAllPinUseCase,
        private readonly getUserUseCase: GetUserUseCase,
        private readonly getWalkwayUseCase: GetWalkwayUseCase,
    ) {}

    @Post()
    @HttpCode(StatusCodes.CREATED)
    @ApiCreatedResponse({
        type: CommonResponse,
    })
    async create(
        @Body() request: CreatePinRequest,
    ): Promise<CommonResponse> {
        // TODO: 차후 Usecase 생성시 추가
        return {
            code: StatusCodes.CREATED,
            responseMessage: 'SUCCESS TO CREATE PIN',
        }
    }

    @Get()
    @ApiOkResponse({
        type: GetAllPinResponse,
    })
    async getAll(
        @Query('walkwayId') walkwayId?: string,
        @Query('userId') userId?: string,
    ): Promise<GetAllPinResponse> {
        const [ walkwayResponse, userResponse ] = await Promise.all([
            this.getWalkwayUseCase.execute({
                id: walkwayId,
            }),
            this.getUserUseCase.execute({
                id: userId,
            }),
        ]);

        let getAllPinUseCaseResponse: IGetAllPinUseCaseResponse;

        if (walkwayResponse) {
            getAllPinUseCaseResponse = await this.getAllPinUseCase.execute({
                walkway: walkwayResponse.walkway,
            });
        };

        if (userResponse) {
            getAllPinUseCaseResponse = await this.getAllPinUseCase.execute({
                user: userResponse.user,
            });
        };

        if (getAllPinUseCaseResponse.code !== GetAllPinUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO GET ALL PIN', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const pins = _.map(getAllPinUseCaseResponse.pins, (pin) => ({
            id: pin.id,
            title: pin.title.value,
            content: pin.content.value,
            image: pin.image ? pin.image.value : null,
            userId: pin.user.id,
        }));

        return {
            pins,
        }
    }

    @Patch('/:pinId')
    @HttpCode(StatusCodes.NO_CONTENT)
    @ApiResponse({
        type: CommonResponse,
    })
    async update(
        @Body() request: UpdatePinRequest,
        @Param('pinId') pinId: string,
    ): Promise<CommonResponse> {
        // TODO: 차후 Usecase 생성시 추가
        return {
            code: StatusCodes.NO_CONTENT,
            responseMessage: 'SUCCESS TO UPDATE PIN',
        }        
    }

    @Delete('/:pinId')
    @HttpCode(StatusCodes.NO_CONTENT)
    @ApiResponse({
        type: CommonResponse,
    })
    async delete(
        @Param('pinId') pinId: string,
    ): Promise<CommonResponse> {
        // TODO: 차후 Usecase 생성시 추가
        return {
            code: StatusCodes.NO_CONTENT,
            responseMessage: 'SUCCESS TO DELETE PIN',
        }
    }
}
