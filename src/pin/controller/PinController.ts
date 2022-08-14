import _ from 'lodash';
import { StatusCodes } from 'http-status-codes';
import { Body, Controller, Delete, Get, HttpCode, HttpException, Logger, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CommonResponse } from '../../common/controller/dto/CommonResponse';
import { CreatePinRequest, UpdatePinRequest } from './dto/PinRequest';
import { GetAllPinResponse, GetPinResponse } from './dto/PinResponse';
import { GetAllPinUseCase, GetAllPinUseCaseCodes } from '../application/GetAllPinUseCase/GetAllPinUseCase';
import { GetUserUseCase, GetUserUseCaseCodes } from '../../user/application/GetUserUseCase/GetUserUseCase';
import { GetWalkwayUseCase, GetWalkwayUseCaseCodes } from '../../walkway/application/GetWalkwayUseCase/GetWalkwayUseCase';
import { IGetAllPinUseCaseResponse } from '../application/GetAllPinUseCase/dto/IGetAllPinUseCaseResponse';
import { CreatePinUseCase, CreatePinUseCaseCodes } from '../application/CreatePinUseCase/CreatePinUseCase';
import { GetPinUseCase, GetPinUseCaseCodes } from '../application/GetPinUseCase/GetPinUseCase';

@Controller('pins')
@ApiTags('핀')
export class PinController {
    constructor(
        private readonly getAllPinUseCase: GetAllPinUseCase,
        private readonly getUserUseCase: GetUserUseCase,
        private readonly getWalkwayUseCase: GetWalkwayUseCase,
        private readonly createPinUseCase: CreatePinUseCase,
        private readonly getPinUseCase: GetPinUseCase,
    ) {}

    @Post()
    @HttpCode(StatusCodes.CREATED)
    @ApiCreatedResponse({
        type: CommonResponse,
    })
    async create(
        @Body() request: CreatePinRequest,
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
            throw new HttpException('FAIL TO CREATE PIN BY WALKWAY', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        if (userResponse.code !== GetUserUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO CREATE PIN BY USER', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const createPinUseCaseResponse = await this.createPinUseCase.execute({
            title: request.title,
            content: request.content,
            image: request.image,
            location: request.location,
            walkway: walkwayResponse.walkway,
            user: userResponse.user,
        });

        if (createPinUseCaseResponse.code !== CreatePinUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO CREATE PIN', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        return {
            code: StatusCodes.CREATED,
            responseMessage: 'SUCCESS TO CREATE PIN',
        }
    }

    @Get()
    @ApiOperation({
        description: 'walkwayId, userId 중에 최대 하나만 보낼 수 있음. '
        + 'walkwayId만 보낼 경우: 해당하는 walkway의 핀 리스트 반환 / '
        + 'userId만 보낼 경우: 해당하는 user의 핀 리스트 반환 / '
        + '둘 다 보내지 않을 경우: 전체 핀 리스트 반환 (둘 다 보내는 건 구현X)'
        + '핀 목록을 시작점(산책로 경로 양 끝점 중 현 위치에 더 가까운 점)에서 가까운 순서로 정렬하기 위해 lat, lng을 받음.'
    })
    @ApiOkResponse({
        type: GetAllPinResponse,
    })
    async getAll(
        @Query('walkwayId') walkwayId?: string,
        @Query('userId') userId?: string,
        @Query('lat') lat?: number,
        @Query('lng') lng?: number
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
                curLocation: {
                    lat,
                    lng,
                },
            });
        };

        if (userResponse) {
            getAllPinUseCaseResponse = await this.getAllPinUseCase.execute({
                user: userResponse.user,
            });
        }

        if (!walkwayResponse && !userResponse) {
            getAllPinUseCaseResponse = await this.getAllPinUseCase.execute({});
        }

        if (getAllPinUseCaseResponse.code !== GetAllPinUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO GET ALL PIN', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const pins = _.map(getAllPinUseCaseResponse.pins, (pin) => ({
            id: pin.id,
            title: pin.title.value,
            content: pin.content.value,
            image: pin.image ? pin.image.value : null,
            location: pin.location.value,
            userId: pin.user.id,
            walkwayId: pin.walkway.id,
        }));

        return {
            pins,
        }
    }

    @Get('/:pinId')
    @ApiOkResponse({
        type: GetPinResponse,
    })
    async getOne(
        @Param('pinId') pinId: string,
    ): Promise<GetPinResponse> {
        const getPinUseCaseResponse = await this.getPinUseCase.execute({
            id: pinId,
        });

        if (getPinUseCaseResponse.code === GetPinUseCaseCodes.NO_PIN_FOUND_ERROR) {
            throw new HttpException(GetPinUseCaseCodes.NO_PIN_FOUND_ERROR, StatusCodes.NOT_FOUND);
        }

        if (getPinUseCaseResponse.code !== GetPinUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO GET PIN', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const pin = {
            id: getPinUseCaseResponse.pin.id,
            title: getPinUseCaseResponse.pin.title.value,
            content: getPinUseCaseResponse.pin.content.value,
            image: getPinUseCaseResponse.pin.image ? getPinUseCaseResponse.pin.image.value : null,
            location: getPinUseCaseResponse.pin.location.value,
            userId: getPinUseCaseResponse.pin.user.id,
            walkwayId: getPinUseCaseResponse.pin.walkway.id,
        };

        return {
            pin,
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
