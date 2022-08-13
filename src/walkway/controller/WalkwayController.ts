import _ from 'lodash';
import { Body, Controller, Delete, Get, HttpCode, HttpException, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';

import { CommonResponse } from '../../common/controller/dto/CommonResponse';
import { CreateSeoulmapWalkwaysUseCase, CreateSeoulmapWalkwaysUseCaseCodes } from '../application/CreateSeoulmapWalkwaysUseCase/CreateSeoulmapWalkwaysUseCase';
import { CreateWalkwayRequest, UpdateWalkwayRequest } from './dto/WalkwayRequest';
import { GetAllNearWalkwayResponse, GetWalkwayResponse, WalkwayDto } from './dto/WalkwayResponse';
import { GetWalkwayUseCase, GetWalkwayUseCaseCodes } from '../application/GetWalkwayUseCase/GetWalkwayUseCase';
import { GetAllPinUseCase, GetAllPinUseCaseCodes } from '../../pin/application/GetAllPinUseCase/GetAllPinUseCase';
import { GetAllReviewUseCase, GetAllReviewUseCaseCodes } from '../../review/application/GetAllReviewUseCase/GetAllReviewUseCase';
import { GetAllNearWalkwayUseCase, GetAllNearWalkwayUseCaseCodes } from '../application/GetAllNearWalkwayUseCase/GetAllNaerWalkwayUseCase';
import { GetSeoulmapWalkwayUseCase } from '../application/GetSeoulMapWalkwayUseCase/GetSeoulmapWalkwayUseCase';

@Controller('walkway')
@ApiTags('산책로')
export class WalkwayController {
    constructor(
        private readonly createSeoulmapWalkwaysUseCase: CreateSeoulmapWalkwaysUseCase,
        private readonly getSeoulmapWalkwayUseCase: GetSeoulmapWalkwayUseCase,
        private readonly getWalkwayUseCase: GetWalkwayUseCase,
        private readonly getAllPinUseCase: GetAllPinUseCase,
        private readonly getAllReviewUseCase: GetAllReviewUseCase,
        private readonly getAllNearWalkwayUseCase: GetAllNearWalkwayUseCase,
    ) {}

    @Post()
    @HttpCode(StatusCodes.CREATED)
    @ApiCreatedResponse({
        type: CommonResponse,
    })
    async create(
        @Body() request: CreateWalkwayRequest,
    ) {}

    @Post('/seoulmap')
    @HttpCode(StatusCodes.CREATED)
    @ApiCreatedResponse({
        type: CommonResponse,
    })
    @ApiOperation({
        summary: '스마트 서울맵 산책로 정보 DB에 저장',
        description: '스마트 서울맵의 산책로 정보를 DB Schema에 맞게 변형해서 저장함. (Path로 대략적인 distance(km) 및 time(분)도 계산함.)'
    })
    @ApiCreatedResponse({
        type: CommonResponse,
    })
    async createSeoulmapWalkways(): Promise<CommonResponse> {
        const values = await this.getSeoulmapWalkwayUseCase.execute();
        if (values.length == 0) {
            throw new HttpException('FAIL TO GET SEOUL MAP WALKWAY DATA', 500);
        }
        const createSeoulmapResponse = await this.createSeoulmapWalkwaysUseCase.execute({ values: values });
        if (createSeoulmapResponse.code !== CreateSeoulmapWalkwaysUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO CREATE SEOUL MAP WALKWAYS', 500);
        }

        return {
            code: StatusCodes.CREATED,
            responseMessage: 'SUCCESS TO CREATE SEOUL MAP WALKWAYS',
        }
    }

    @Get('/list')
    @ApiOkResponse({
        type: GetAllNearWalkwayResponse,
    })
    @ApiOperation({
        summary: '추천 산책로 목록 가져오기',
        description: 'query로 받은 좌표에서 반경 2km 이내에 있는 산책로 목록을 리턴함.'
    })
    async getAllNear(
        @Query('lat') lat: number,
        @Query('lng') lng: number
    ) {
        const getAllNearWalkwayResponse = await this.getAllNearWalkwayUseCase.execute({
            coordinates: { lat, lng },
        });
        if (getAllNearWalkwayResponse.code != GetAllNearWalkwayUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO FIND NEAR WALKWAYS', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        let walkways = []
        for (const walkway of getAllNearWalkwayResponse.walkways) {
            const getAllPinUseCaseResponse = await this.getAllPinUseCase.execute({
                walkway: walkway,
            })
            if (getAllPinUseCaseResponse.code !== GetAllPinUseCaseCodes.SUCCESS) {
                throw new HttpException('FAIL TO FIND ALL PIN', StatusCodes.INTERNAL_SERVER_ERROR);
            }
    
            const getAllReviewUseCaseResponse = await this.getAllReviewUseCase.execute({
                walkway: walkway,
            })
            if (getAllReviewUseCaseResponse.code !== GetAllReviewUseCaseCodes.SUCCESS) {
                throw new HttpException('FAIL TO FIND ALL REVIEW', StatusCodes.INTERNAL_SERVER_ERROR);
            }
    
            let tmp = {
                id: walkway.id,
                title: walkway.title.value,
                address: walkway.address.value,
                distance: walkway.distance.value,
                time: walkway.time.value,
                pinCount: getAllPinUseCaseResponse.pins.length,
                averageStar: getAllReviewUseCaseResponse.averageStar,
                path: walkway.path.value,
            }
            if (_.isNil(walkway.user)) {
                tmp['creator'] = '스마트서울맵';
                tmp['creatorId'] = null;
            }
            else {
                tmp['creator'] = walkway.user.name.value;
                tmp['creatorId'] = walkway.user.id;
            }
            walkways.push(tmp);
        }
        return {
            walkways,
        }
    }

    @Get('/:walkwayId')
    @ApiOkResponse({
        type: GetWalkwayResponse,
    })
    async getWalkway(@Param('walkwayId') walkwayId: string): Promise<GetWalkwayResponse> {
        const getWalkwayUseCaseResponse = await this.getWalkwayUseCase.execute({
            id: walkwayId,
        });
        if (getWalkwayUseCaseResponse.code !== GetWalkwayUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO FIND WALKWAY', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const getAllPinUseCaseResponse = await this.getAllPinUseCase.execute({
            walkway: getWalkwayUseCaseResponse.walkway,
        })
        if (getAllPinUseCaseResponse.code !== GetAllPinUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO FIND ALL PIN', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const getAllReviewUseCaseResponse = await this.getAllReviewUseCase.execute({
            walkway: getWalkwayUseCaseResponse.walkway,
        })
        if (getAllReviewUseCaseResponse.code !== GetAllReviewUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO FIND ALL REVIEW', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        let creator = '스마트서울맵';
        let creatorId = null;
        if (!_.isNil(getWalkwayUseCaseResponse.walkway.user)) {
            creator = getWalkwayUseCaseResponse.walkway.user.name.value;
            creatorId = getWalkwayUseCaseResponse.walkway.user.id;
        }
        const walkway : WalkwayDto = {
            id: getWalkwayUseCaseResponse.walkway.id,
            title: getWalkwayUseCaseResponse.walkway.title.value,
            address: getWalkwayUseCaseResponse.walkway.address.value,
            distance: getWalkwayUseCaseResponse.walkway.distance.value,
            time: getWalkwayUseCaseResponse.walkway.time.value,
            pinCount: getAllPinUseCaseResponse.pins.length,
            averageStar: getAllReviewUseCaseResponse.averageStar,
            path: getWalkwayUseCaseResponse.walkway.path.value,
            creator,
            creatorId,
        };

        return {
            walkway,
        };
    }

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
