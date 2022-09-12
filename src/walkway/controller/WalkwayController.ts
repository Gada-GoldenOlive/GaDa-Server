import _ from 'lodash';
import { Body, Controller, Delete, Get, HttpCode, HttpException, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';
import { LineString } from 'geojson';

import { CommonResponse } from '../../common/controller/dto/CommonResponse';
import { CreateSeoulmapWalkwaysUseCase, CreateSeoulmapWalkwaysUseCaseCodes } from '../application/CreateSeoulmapWalkwaysUseCase/CreateSeoulmapWalkwaysUseCase';
import { CreateWalkRequest, CreateWalkwayRequest, UpdateWalkRequest, UpdateWalkwayRequest } from './dto/WalkwayRequest';
import { GetAllWalkResponse, GetAllWalkwayResponse, GetWalkwayResponse, PointDto, WalkwayDto } from './dto/WalkwayResponse';
import { GetWalkwayUseCase, GetWalkwayUseCaseCodes } from '../application/GetWalkwayUseCase/GetWalkwayUseCase';
import { GetAllPinUseCase, GetAllPinUseCaseCodes } from '../../pin/application/GetAllPinUseCase/GetAllPinUseCase';
import { GetAllReviewUseCase, GetAllReviewUseCaseCodes } from '../../review/application/GetAllReviewUseCase/GetAllReviewUseCase';
import { GetAllWalkwayUseCase, GetAllWalkwayUseCaseCodes } from '../application/GetAllWalkwayUseCase/GetAllWalkwayUseCase';
import { GetSeoulmapWalkwayUseCase } from '../application/GetSeoulMapWalkwayUseCase/GetSeoulmapWalkwayUseCase';
import { Point } from '../domain/Walkway/WalkwayEndPoint';
import { GetUserUseCase, GetUserUseCaseCodes } from '../../user/application/GetUserUseCase/GetUserUseCase';
import { CreateWalkUseCase, CreateWalkUseCaseCodes } from '../application/CreateWalkUseCase/CreateWalkUseCase';
import { GetAllWalkUseCase } from '../application/GetAllWalkUseCase/GetAllWalkUseCase';
import { GET_ALL_WALK_OPTION } from '../application/GetAllWalkUseCase/dto/GetAllWalkUseCaseRequest';

const getDistance = (p1: Point, p2: Point) => {
    const geojsonLength = require('geojson-length');
    const line: LineString = {
        'type': 'LineString',
        'coordinates': [[p1.lat, p1.lng], [p2.lat, p2.lng]],
    }
    return +(geojsonLength(line)) ;
}

const getRandomImage = () => {
    const randomNum = Math.floor(Math.random() * 1085);
    return 'https://picsum.photos/150/150/?image=' + randomNum;
}

@Controller('walkways')
@ApiTags('산책로')
export class WalkwayController {
    constructor(
        private readonly createSeoulmapWalkwaysUseCase: CreateSeoulmapWalkwaysUseCase,
        private readonly getSeoulmapWalkwayUseCase: GetSeoulmapWalkwayUseCase,
        private readonly getWalkwayUseCase: GetWalkwayUseCase,
        private readonly getAllPinUseCase: GetAllPinUseCase,
        private readonly getAllReviewUseCase: GetAllReviewUseCase,
        private readonly getAllWalkwayUseCase: GetAllWalkwayUseCase,
        private readonly createWalkUseCase: CreateWalkUseCase,
        private readonly getUserUseCase: GetUserUseCase,
        private readonly getAllWalkUseCase: GetAllWalkUseCase,
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

    @Post('/walks')
    @HttpCode(StatusCodes.CREATED)
    @ApiCreatedResponse({
        type: CommonResponse,
    })
    async createWalk(
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
        type: GetAllWalkwayResponse,
    })
    @ApiOperation({
        summary: '추천 산책로 목록 가져오기',
        description: 'query로 받은 좌표에서 반경 2km 이내에 있는 산책로 목록을 리턴함.'
    })
    async getAll(
        @Query('lat') lat: number,
        @Query('lng') lng: number
    ) {
        const getAllWalkwayResponse = await this.getAllWalkwayUseCase.execute({
            coordinates: { lat, lng },
        });
<<<<<<< HEAD
        if (getAllWalkwayResponse.code != GetAllWalkwayUseCaseCodes.SUCCESS) {
=======
        if (getAllNearWalkwayResponse.code !== GetAllNearWalkwayUseCaseCodes.SUCCESS) {
>>>>>>> 50ada95 (마이페이지에 유저 한 명 받아오는 API 완성)
            throw new HttpException('FAIL TO FIND NEAR WALKWAYS', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        let walkways = []
        for (const walkway of getAllWalkwayResponse.walkways) {
            const getAllPinUseCaseResponse = await this.getAllPinUseCase.execute({
                walkway: walkway,
                curLocation: {
                    lat,
                    lng,
                }
            });
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
                image: getRandomImage(),
                creater: walkway.user ? walkway.user.name.value : '스마트서울맵',
                creatorId: walkway.user ? walkway.user.id : null,
            }
            if (getDistance(walkway.startPoint.value, {lat, lng}) < getDistance(walkway.endPoint.value, {lat, lng})) {
                tmp['startPoint'] = walkway.startPoint.value;
            }
            else {
                tmp['startPoint'] = walkway.endPoint.value;
                tmp.path = tmp.path.reverse();
            }
            walkways.push(tmp);
        }
        return {
            walkways,
        }
    }

    @Get('/walks')
    @ApiOkResponse({
        type: GetAllWalkResponse,
    })
    @ApiOperation({
        summary: 'qeury로 받은 유저의 산책기록을 최신순으로 가져오기',
        description: 'rate는 (실제 이동한 거리/산책로의 거리) * 100 / userId는 산책로 작성자가 아닌, 산책기록을 남긴 유저'
        + ' / option이 0이면 산책로 정보와 함께 전체 walk 목록 리턴(최근활동), 1이면 time, distance에 유저 기록과 함께 아직 리뷰가 없는 walk 목록 리턴(산책로가져오기)'
        + ' / option을 주지 않으면 최근활동'
    })
    async getAllWalk(
        @Query('userId') userId: string,
        @Query('option') option?: number,
    ) {
        option = _.isNil(option) ? GET_ALL_WALK_OPTION.WALKWAY_INFO : option
        const getAllWalkUseCaseResponse = await this.getAllWalkUseCase.execute({
            userId: userId,
            option: option,
        });

        if (getAllWalkUseCaseResponse.code !== GetAllPinUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO FIND ALL WALK', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const getRate = (walkDistance, walkwayDistance) => {
            let rate = +((walkDistance / walkwayDistance) * 100).toFixed(1);

            return rate > 100 ? 100 : rate;
        }

        const walks = _.map(getAllWalkUseCaseResponse.walks, (walk) => ({
            id: walk.id,
            finishStatus: walk.finishStatus,
            rate: getRate(walk.distance.value, walk.walkway.distance.value),
            distance: option === GET_ALL_WALK_OPTION.WALKWAY_INFO ? walk.walkway.distance.value : walk.distance.value,
            time: option === GET_ALL_WALK_OPTION.WALKWAY_INFO ? walk.walkway.time.value : walk.time.value,
            title: walk.walkway.title.value,
            image: walk.walkway.image.value,
            walkwayId: walk.walkway.id,
            userId: walk.user.id,
            createAt: walk.createdAt,
            updatedAt: walk.updatedAt,
        }));

        return walks;
    }

    @Get('/:walkwayId')
    @ApiOkResponse({
        type: GetWalkwayResponse,
    })
    @ApiOperation({
        summary: '개별 산책로 정보 가져오기',
        description: '경로의 양 끝점 중 현 위치에서 가까운 점을 startPoint로 설정하기 위해 현 위치를 query로 받음.'
    })
    async getWalkway(
        @Param('walkwayId') walkwayId: string,
        @Query('lat') lat: number,
        @Query('lng') lng: number
    ): Promise<GetWalkwayResponse> {
        const getWalkwayUseCaseResponse = await this.getWalkwayUseCase.execute({
            id: walkwayId,
        });
        if (getWalkwayUseCaseResponse.code !== GetWalkwayUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO FIND WALKWAY', StatusCodes.INTERNAL_SERVER_ERROR);
        }
        if (_.isNil(getWalkwayUseCaseResponse.walkway))
            return {};

        const getAllPinUseCaseResponse = await this.getAllPinUseCase.execute({
            walkway: getWalkwayUseCaseResponse.walkway,
            curLocation: {
                lat,
                lng,
            }
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

        let startPoint = {
            lat: getWalkwayUseCaseResponse.walkway.startPoint.value.lat,
            lng: getWalkwayUseCaseResponse.walkway.startPoint.value.lng,
        }
        let path: PointDto[] = getWalkwayUseCaseResponse.walkway.path.value;
        if (getDistance(getWalkwayUseCaseResponse.walkway.startPoint.value, {lat, lng})
            > getDistance(getWalkwayUseCaseResponse.walkway.endPoint.value, {lat, lng})) {
            startPoint = {
                lat: getWalkwayUseCaseResponse.walkway.endPoint.value.lat,
                lng: getWalkwayUseCaseResponse.walkway.endPoint.value.lng,
            }
            path = path.reverse();
        }

        const walkway: WalkwayDto = {
            id: getWalkwayUseCaseResponse.walkway.id,
            title: getWalkwayUseCaseResponse.walkway.title.value,
            address: getWalkwayUseCaseResponse.walkway.address.value,
            distance: getWalkwayUseCaseResponse.walkway.distance.value,
            time: getWalkwayUseCaseResponse.walkway.time.value,
            pinCount: getAllPinUseCaseResponse.pins.length,
            averageStar: getAllReviewUseCaseResponse.averageStar,
            path,
            image: getRandomImage(),
            creator: getWalkwayUseCaseResponse.walkway.user ? getWalkwayUseCaseResponse.walkway.user.name.value : '스마트서울맵',
            creatorId: getWalkwayUseCaseResponse.walkway.user ? getWalkwayUseCaseResponse.walkway.user.id : null,
            startPoint,
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

    @Patch('/walks/:walkId')
    @ApiResponse({
        type: CommonResponse,
    })
    async updateWalk(
        @Body() request: UpdateWalkRequest,
    ): Promise<CommonResponse> {
        return {
            code: StatusCodes.NO_CONTENT,
            responseMessage: 'SUCCESS TO UPDATE WALK'
        }
    }

    @Delete('/:walkwayId')
    @ApiResponse({
        type: CommonResponse,
    })
    async delete() {}

    @Delete('/walks/:walkId')
    @ApiResponse({
        type: CommonResponse,
    })
    async deleteWalk() {}
}
