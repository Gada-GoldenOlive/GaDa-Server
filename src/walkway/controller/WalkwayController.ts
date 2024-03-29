import _ from 'lodash';
import { Body, Controller, DefaultValuePipe, Delete, Get, HttpCode, HttpException, Param, ParseFloatPipe, ParseIntPipe, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';
import { LineString } from 'geojson';

import { CommonResponse } from '../../common/controller/dto/CommonResponse';
import { CreateSeoulmapWalkwaysUseCase, CreateSeoulmapWalkwaysUseCaseCodes } from '../application/CreateSeoulmapWalkwaysUseCase/CreateSeoulmapWalkwaysUseCase';
import { CreateWalkRequest, CreateWalkwayRequest, UpdateWalkRequest, UpdateWalkwayRequest } from './dto/WalkwayRequest';
import { CreateResponse, GetAllWalkPaginationResponse, GetAllWalkResponse, GetAllWalkwayResponse, GetWalkResponse, GetWalkwayResponse, PointDto, WalkDetailDto, WalkListDto, WalkwayDto } from './dto/WalkwayResponse';
import { GetWalkwayUseCase, GetWalkwayUseCaseCodes } from '../application/GetWalkwayUseCase/GetWalkwayUseCase';
import { GetAllPinUseCase, GetAllPinUseCaseCodes } from '../../pin/application/GetAllPinUseCase/GetAllPinUseCase';
import { GetAllReviewUseCase, GetAllReviewUseCaseCodes } from '../../review/application/GetAllReviewUseCase/GetAllReviewUseCase';
import { GetAllWalkwayUseCase, GetAllWalkwayUseCaseCodes } from '../application/GetAllWalkwayUseCase/GetAllWalkwayUseCase';
import { GetSeoulmapWalkwayUseCase } from '../application/GetSeoulMapWalkwayUseCase/GetSeoulmapWalkwayUseCase';
import { Point } from '../domain/Walkway/WalkwayEndPoint';
import { CreateWalkUseCase, CreateWalkUseCaseCodes } from '../application/CreateWalkUseCase/CreateWalkUseCase';
import { GetAllWalkUseCase, GetAllWalkUseCaseCodes } from '../application/GetAllWalkUseCase/GetAllWalkUseCase';
import { CreateWalkwayUseCase, CreateWalkwayUseCaseCodes } from '../application/CreateWalkwayUseCase/CreateWalkwayUseCase';
import { WalkwayOwnerGuard } from '../walkway-owner.guard';
import { WalkOwnerGuard } from '../walk-owner.guard';
import { JwtAuthGuard } from '../../auth/jwt-auth.gaurd';
import { GetWalkUseCase, GetWalkUseCaseCodes } from '../application/GetWalkUseCase/GetWalkUseCase';
import { UserStatus } from '../../user/domain/User/UserStatus';
import { UpdateUserUseCase, UpdateUserUseCaseCodes } from '../../user/application/UpdateUserUseCase/UpdateUserUseCase';
import { GetAchieveUseCase, GetAchieveUseCaseCodes } from '../../badge/application/GetAchieveUseCase/GetAchieveUseCase';
import { UpdateAchieveUseCase, UpdateAchieveUseCaseCodes } from '../../badge/application/UpdateAchieveUseCase/UpdateAchieveUseCase';
import { BadgeCategory, BADGE_CATEGORY } from '../../badge/domain/Badge/BadgeCategory';
import { BadgeCode, BADGE_CODE } from '../../badge/domain/Badge/BadgeCode';
import { Achieve } from '../../badge/domain/Achieve/Achieve';
import { User } from '../../user/domain/User/User';
import { AchieveStatus } from '../../badge/domain/Achieve/AchieveStatus';
import { DeleteWalkwayUseCase, DeleteWalkwayUseCaseCodes } from '../application/DeleteWalkwayUseCase/DeleteWalkwayUseCase';
import { UpdateWalkwayUseCase, UpdateWalkwayUseCaseCodes } from '../application/UpdateWalkwayUseCase/UpdateWalkwayUseCase';
import { Walkway } from '../domain/Walkway/Walkway';
import { WalkFinishStatus } from '../domain/Walk/WalkFinishStatus';

@Controller('walkways')
@ApiTags('산책로')
export class WalkwayController {
    constructor(
        private readonly createSeoulmapWalkwaysUseCase: CreateSeoulmapWalkwaysUseCase,
        private readonly getSeoulmapWalkwayUseCase: GetSeoulmapWalkwayUseCase,
        private readonly getWalkwayUseCase: GetWalkwayUseCase,
        private readonly deleteWalkwayUseCase: DeleteWalkwayUseCase,
        private readonly getAllPinUseCase: GetAllPinUseCase,
        private readonly getAllReviewUseCase: GetAllReviewUseCase,
        private readonly getAllWalkwayUseCase: GetAllWalkwayUseCase,
        private readonly createWalkUseCase: CreateWalkUseCase,
        private readonly getAllWalkUseCase: GetAllWalkUseCase,
        private readonly createWalkwayUseCase: CreateWalkwayUseCase,
        private readonly getWalkUseCase: GetWalkUseCase,
        private readonly updateUserUseCase: UpdateUserUseCase,
        private readonly updateWalkwayUseCase: UpdateWalkwayUseCase,
        private readonly getAchieveUseCase: GetAchieveUseCase,
        private readonly updateAchieveUseCase: UpdateAchieveUseCase,
    ) {}

    private achieves: Achieve[] = null;

    private async pushAchieve(user: User, category: BadgeCategory, code: BadgeCode, achieves: Achieve[]): Promise<boolean> {
        const getAchieveUseCaseResponse = await this.getAchieveUseCase.execute({
            user,
            category: category as BADGE_CATEGORY,
            code: code as BADGE_CODE,
        });

        // NOTE: not_exist_achieve는 있을 수 있으니까 failure일때만으로 설정함
        if (getAchieveUseCaseResponse.code === GetAchieveUseCaseCodes.FAILURE) {
            throw new HttpException('FAIL TO GET ACHIEVE', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const achieve = getAchieveUseCaseResponse.achieve;

        if (getAchieveUseCaseResponse.code !== GetAchieveUseCaseCodes.NOT_EXIST_ACHIEVE) {
            achieves.unshift(achieve);
        }

        return true;
    }

    private getDistance(p1: Point, p2: Point) {
        const geojsonLength = require('geojson-length');
        const line: LineString = {
            'type': 'LineString',
            'coordinates': [[p1.lat, p1.lng], [p2.lat, p2.lng]],
        };
        return +(geojsonLength(line));
    };

    private async convertToWalkwayDto(walkway: Walkway, lat: number, lng: number): Promise<WalkwayDto> {
        const getAllPinUseCaseResponse = await this.getAllPinUseCase.execute({
            walkway,
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
        });

        if (getAllReviewUseCaseResponse.code !== GetAllReviewUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO FIND ALL REVIEW', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        let startPoint = {
            lat: walkway.startPoint.value.lat,
            lng: walkway.startPoint.value.lng,
        };

        let path: PointDto[] = walkway.path.value;

        if (this.getDistance(walkway.startPoint.value, {lat, lng})
            > this.getDistance(walkway.endPoint.value, {lat, lng})) {
            startPoint = {
                lat: walkway.endPoint.value.lat,
                lng: walkway.endPoint.value.lng,
            };
            path = path.reverse();
        }

        let creator = walkway.user ? walkway.user.name.value : '스마트서울맵';
        let creatorId = walkway.user ? walkway.user.id : null;
        
        if (walkway.user && walkway.user.status === UserStatus.DELETE) {
            creator = '탈퇴한 회원';
            creatorId = '  ';
        }

        return {
            id: walkway.id,
            title: walkway.title.value,
            address: walkway.address.value,
            distance: walkway.distance.value,
            time: walkway.time.value,
            pinCount: getAllPinUseCaseResponse.pins.length,
            averageStar: getAllReviewUseCaseResponse.averageStar,
            path: walkway.path.value,
            image: walkway.image ? walkway.image.value : null,
            creator,
            creatorId,
            startPoint,
        };
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @HttpCode(StatusCodes.CREATED)
    @ApiCreatedResponse({
        type: CreateResponse,
    })
    @ApiOperation({
        summary: '산책로 생성 (배지 리턴)',
        description: '산책로 생성! 배지가 리턴됨.<br>'
        + '- 하나만 리턴됨'
    })
    async create(
        @Request() request,
        @Body() body: CreateWalkwayRequest,
    ): Promise<CreateResponse> {
        this.achieves = [];

        const createWalkwayUseCaseResponse = await this.createWalkwayUseCase.execute({
            title: body.title,
            address: body.address,
            distance: body.distance,
            time: body.time,
            path: body.path,
            image: body.image,
            user: request.user,
            status: body.status,
        });

        if (createWalkwayUseCaseResponse.code !== CreateWalkwayUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO CREATE WALKWAY', StatusCodes.INTERNAL_SERVER_ERROR);
        }
        
        await this.pushAchieve(request.user, BadgeCategory.WALKWAY, BadgeCode.FIRST, this.achieves);

        if (this.achieves.length !== 0) {
            _.map(this.achieves, async (achieve) => {
                const updateAchieveUseCaseResponse = await this.updateAchieveUseCase.execute({
                    id: achieve.id,
                    status: AchieveStatus.ACHIEVE,
                });
    
                if (updateAchieveUseCaseResponse.code !== UpdateAchieveUseCaseCodes.SUCCESS) {
                    throw new HttpException('FAIL TO UPDATE ACHIEVE', StatusCodes.INTERNAL_SERVER_ERROR);
                }
            });

            return {
                code: StatusCodes.CREATED,
                responseMessage: 'SUCCESS TO CREATE WALKWAY AND GET BADGE',
                achieves: _.map(this.achieves, (achieve) => {
                    return {
                        badge: {
                            title: achieve.badge.title.value,
                            image: achieve.badge.image.value,
                        },
                        status: achieve.status,
                    };
                }),
                id: createWalkwayUseCaseResponse.walkway.id,
            };
        }

        return {
            code: StatusCodes.CREATED,
            responseMessage: 'SUCCESS TO CREATE WALKWAY',
            id: createWalkwayUseCaseResponse.walkway.id,
        };
    }

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
        };
    }

    @Post('/walks')
    @UseGuards(JwtAuthGuard)
    @HttpCode(StatusCodes.CREATED)
    @ApiCreatedResponse({
        type: CreateResponse,
    })
    @ApiOperation({
        summary: 'walk(산책기록) 생성 (배지 리턴)',
        description: '"거리 nkm 달성!" / "산책 n시간 달성!" / "산책로 n개 달성!" 배지가 리턴될 수 있음.'
        + '- status가 NON_ACHIEVE면 일반 배지, HIDDEN이면 히든 배지<br>'
        + '- 여러 개 동시에 리턴 가능<br>'
        + '- 거리 -> 산책 -> 산책로 배지 순으로 리턴됨'
    })
    async createWalk(
        @Request() request,
        @Body() body: CreateWalkRequest,
    ): Promise<CreateResponse> {
        this.achieves = [];

        const walkwayResponse = await this.getWalkwayUseCase.execute({
            id: body.walkwayId,
        });

        if (walkwayResponse.code !== GetWalkwayUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO CREATE WALK BY WALKWAY', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const createWalkUseCaseResponse = await this.createWalkUseCase.execute({
            time: body.time,
            distance: body.distance,
            pinCount: body.pinCount,
            finishStatus: body.finishStatus,
            user: request.user,
            walkway: walkwayResponse.walkway,
        });

        if (createWalkUseCaseResponse.code !== CreateWalkUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO CREATE WALK', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const updateUserUseCaseResponse = await this.updateUserUseCase.execute({
            id: request.user.id,
            totalDistance: request.user.totalDistance.value + body.distance,
            totalTime: request.user.totalTime.value + body.time,
            weekDistance: request.user.weekDistance.value + body.distance,
            weekTime: request.user.weekTime.value + body.time,
        });

        if (updateUserUseCaseResponse.code !== UpdateUserUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO UPDATE USER', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const user = updateUserUseCaseResponse.user;

        if (user.totalDistance.value >= 50000) {
            await this.pushAchieve(request.user, BadgeCategory.DISTANCE, BadgeCode.FIFTY, this.achieves);
        }
        
        if (user.totalDistance.value >= 20000) {
            await this.pushAchieve(request.user, BadgeCategory.DISTANCE, BadgeCode.TWENTY, this.achieves);
        }
        if (user.totalDistance.value >= 10000) {
            await this.pushAchieve(request.user, BadgeCategory.DISTANCE, BadgeCode.TEN, this.achieves);
        }
        if (user.totalDistance.value >= 5000) {
            await this.pushAchieve(request.user, BadgeCategory.DISTANCE, BadgeCode.FIVE, this.achieves);
        }
        if (user.totalDistance.value >= 3000) {
            await this.pushAchieve(request.user, BadgeCategory.DISTANCE, BadgeCode.THREE, this.achieves);   
        }

        if (user.totalTime.value >= 180000) {
            await this.pushAchieve(request.user, BadgeCategory.WALKTIME, BadgeCode.FIFTY, this.achieves);
        }
        if (user.totalTime.value >= 72000) {
            await this.pushAchieve(request.user, BadgeCategory.WALKTIME, BadgeCode.TWENTY, this.achieves);
        }
        if (user.totalTime.value >= 36000) {
            await this.pushAchieve(request.user, BadgeCategory.WALKTIME, BadgeCode.TEN, this.achieves);
        }
        if (user.totalTime.value >= 18000) {
            await this.pushAchieve(request.user, BadgeCategory.WALKTIME, BadgeCode.FIVE, this.achieves);
        }
        if (user.totalTime.value >= 10800) {
            await this.pushAchieve(request.user, BadgeCategory.WALKTIME, BadgeCode.THREE, this.achieves);  
        }

        if (body.finishStatus === WalkFinishStatus.FINISHED) {
            const getAllWalkUseCaseResponse = await this.getAllWalkUseCase.execute({
                user,
                finishStatus: WalkFinishStatus.FINISHED,
            });

            if (getAllWalkUseCaseResponse.code !== GetAllWalkUseCaseCodes.SUCCESS) {
                throw new HttpException('FAIL TO GET ALL WALK', StatusCodes.INTERNAL_SERVER_ERROR);
            }

            const walks = getAllWalkUseCaseResponse.walks;

            if (walks.length >= 100) {
                await this.pushAchieve(request.user, BadgeCategory.WALKWAY, BadgeCode.HUNDRED, this.achieves);
            }
            else if (walks.length >= 20) {
                await this.pushAchieve(request.user, BadgeCategory.WALKWAY, BadgeCode.TWENTY, this.achieves);
            }
            else if (walks.length >= 10) {
                await this.pushAchieve(request.user, BadgeCategory.WALKWAY, BadgeCode.TEN, this.achieves);
            }
            else if (walks.length >= 5) {
                await this.pushAchieve(request.user, BadgeCategory.WALKWAY, BadgeCode.FIVE, this.achieves);
            }
            else if (walks.length >= 3) {
                await this.pushAchieve(request.user, BadgeCategory.WALKWAY, BadgeCode.THREE, this.achieves);
            }
        }

        if (this.achieves.length !== 0) {
            _.map(this.achieves, async (achieve) => {
                const updateAchieveUseCaseResponse = await this.updateAchieveUseCase.execute({
                    id: achieve.id,
                    status: AchieveStatus.ACHIEVE,
                });

                if (updateAchieveUseCaseResponse.code !== UpdateAchieveUseCaseCodes.SUCCESS) {
                    throw new HttpException('FAIL TO UPDATE ACHIEVE', StatusCodes.INTERNAL_SERVER_ERROR);
                }
            });

            return {
                code: StatusCodes.CREATED,
                responseMessage: 'SUCCESS TO CREATE WALK AND GET BADGE',
                achieves: _.map(this.achieves, (achieve) => {
                    return {
                        badge: {
                            title: achieve.badge.title.value,
                            image: achieve.badge.image.value,
                        },
                        status: achieve.status,
                    };
                }),
                id: createWalkUseCaseResponse.walk.id,
            };
        }

        return {
            code: StatusCodes.CREATED,
            responseMessage: 'SUCCESS TO CREATE WALK',
            id: createWalkUseCaseResponse.walk.id,
        };
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({
        type: GetAllWalkwayResponse,
    })
    @ApiOperation({
        summary: '추천 산책로 목록 조회',
        description: 'query로 받은 좌표에서 반경 2km 이내에 있는 산책로 목록을 리턴함.'
    })
    async getAll(
        @Query('lat') lat: number,
        @Query('lng') lng: number,
        @Request() request,
    ) {
        const getAllWalkwayResponse = await this.getAllWalkwayUseCase.execute({
            coordinates: { lat, lng },
            userId: request.user.id,
        });

        if (getAllWalkwayResponse.code !== GetAllWalkwayUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO FIND NEAR WALKWAYS', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const walkways: WalkwayDto[] = await Promise.all(_.map(getAllWalkwayResponse.walkways, (walkway) => {
            return this.convertToWalkwayDto(walkway, lat, lng);
        }));

        return {
            walkways,
        };
    }

    @Get('/my')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({
        type: GetAllWalkwayResponse,
    })
    @ApiOperation({
        summary: '내가 만든 산책로 목록 조회',
        description: 'token에 해당하는 유저가 만든 산책로 전체 목록을 최신순으로 리턴',
    })
        async getAllMyWalkway(
        @Request() request,
    ) {
        const getAllWalkwayResponse = await this.getAllWalkwayUseCase.execute({
            userId: request.user.id,
        });

        if (getAllWalkwayResponse.code !== GetAllWalkwayUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO FIND WALKWAYS', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const walkways: WalkwayDto[] = await Promise.all(_.map(getAllWalkwayResponse.walkways, (walkway) => {
            return this.convertToWalkwayDto(walkway, 37.5666805, 126.9784147);
        }));

        return {
            walkways,
        };
    }

    @Get('/walks')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({
        type: GetAllWalkPaginationResponse,
    })
    @ApiOperation({
        summary: '유저의 전체 산책기록을 최신순으로 조회 (최근활동)',
        description: 'rate는 (실제 이동한 거리/산책로의 거리) * 100 <br>'
        + 'userId는 산책로 작성자가 아닌, 산책기록을 남긴 유저이고 distance, time은 walkway의 정보'
        + 'page는 page index, 1부터 시작 (default: 1)<br>'
        + 'limit는 한 페이지 내의 아이템 수 (default: 10)'
    })
    async getAllWalk(
        @Request() request,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
        ): Promise<GetAllWalkPaginationResponse> {
            const getAllWalkUseCaseResponse = await this.getAllWalkUseCase.execute({
                user: request.user,
                paginationOptions: {
                    page,
                    limit,
                    route: 'http://15.165.77.113:3000/walkways/walks',
                },
        });

        if (getAllWalkUseCaseResponse.code !== GetAllPinUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO FIND ALL WALK', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const getRate = (walkDistance, walkwayDistance) => {
            let rate = +((walkDistance / walkwayDistance) * 100).toFixed(1);
        
            return rate > 100 ? 100 : rate;
        };

        const walks = _.map(getAllWalkUseCaseResponse.walks, function(walk): WalkListDto {
            return {
                id: walk.id,
                finishStatus: walk.finishStatus,
                rate: getRate(walk.distance.value, walk.walkway.distance.value),
                distance: walk.walkway.distance.value,
                time: walk.walkway.time.value,
                title: walk.walkway.title.value,
                image: walk.walkway.image ? walk.walkway.image.value : null,
                createdAt: walk.createdAt,
            };
        });

        return {
            walks,
            meta: getAllWalkUseCaseResponse.meta,
            links: getAllWalkUseCaseResponse.links,
        };
    }

    @Get('/no-review-walks')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({
        type: GetAllWalkResponse,
    })
    @ApiOperation({
        summary: '아직 리뷰를 작성하지 않은 산책기록을 최신순으로 조회 (산책로가져오기)',
        description: 'rate는 (실제 이동한 거리/산책로의 거리) * 100 <br>'
        + 'userId는 산책로 작성자가 아닌, 산책기록을 남긴 유저이고 time, distance는 유저의 산책 기록'
    })
    async getAllNonReviewWalk(
        @Request() request,
    ): Promise<GetAllWalkResponse> {
        const getAllWalkUseCaseResponse = await this.getAllWalkUseCase.execute({
            user: request.user,
        });

        if (getAllWalkUseCaseResponse.code !== GetAllPinUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO FIND ALL WALK', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        let _walks = getAllWalkUseCaseResponse.walks;

        // NOTE: 이미 리뷰를 작성한 walk를 필터링
        const getAllReviewUseCaseResponse = await this.getAllReviewUseCase.execute({
            user: request.user,
        });

        if (getAllReviewUseCaseResponse.code !== GetAllReviewUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO FIND ALL WALK BY REVIEW', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const reviews = getAllReviewUseCaseResponse.reviews;

        const review_walkIds = _.map(reviews, (review) => 
            review.walk.id,
        );

        _walks = _.filter(_walks, (walk) => {
            return !review_walkIds.includes(walk.id);
        });
        
        const getRate = (walkDistance, walkwayDistance) => {
            let rate = +((walkDistance / walkwayDistance) * 100).toFixed(1);
        
            return rate > 100 ? 100 : rate;
        };

        const walks = _.map(_walks, function(walk): WalkListDto {
            return {
                id: walk.id,
                finishStatus: walk.finishStatus,
                rate: getRate(walk.distance.value, walk.walkway.distance.value),
                distance: walk.distance.value,
                time: walk.time.value,
                title: walk.walkway.title.value,
                image: walk.walkway.image ? walk.walkway.image.value : null,
                createdAt: walk.createdAt,
            };
        });

        return {
            walks,
        };
    }

    @Get('/:walkwayId')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({
        type: GetWalkwayResponse,
    })
    @ApiOperation({
        summary: '개별 산책로 정보 조회',
        description: '경로의 양 끝점 중 현 위치에서 가까운 점을 startPoint로 설정하기 위해 현 위치를 query로 받음.'
    })
    async getWalkway(
        @Param('walkwayId') walkwayId: string,
        @Query('lat', new DefaultValuePipe(37.5666805), ParseFloatPipe) lat: number=37.5666805,
        @Query('lng', new DefaultValuePipe(126.9784147), ParseFloatPipe) lng: number=126.9784147,
    ): Promise<GetWalkwayResponse> {
        const getWalkwayUseCaseResponse = await this.getWalkwayUseCase.execute({
            id: walkwayId,
        });

        if (getWalkwayUseCaseResponse.code === GetWalkwayUseCaseCodes.NOT_EXIST_WALKWAY) {
            throw new HttpException(GetWalkwayUseCaseCodes.NOT_EXIST_WALKWAY, StatusCodes.NOT_FOUND);
        }
        
        if (getWalkwayUseCaseResponse.code !== GetWalkwayUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO FIND WALKWAY', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const walkway = await this.convertToWalkwayDto(getWalkwayUseCaseResponse.walkway, lat, lng);
        
        return {
            walkway,
        };
    }

    @Get('/walks/:walkId')
    @UseGuards(JwtAuthGuard)
    @ApiResponse({
        type: GetWalkResponse,
    })
    @ApiOperation({
        summary: '개별 산책기록 조회',
    })
    async getWalk(
        @Param('walkId') walkId: string,
    ): Promise<GetWalkResponse> {
        const getWalkUseCaseResponse = await this.getWalkUseCase.execute({
            id: walkId,
        });

        if (getWalkUseCaseResponse.code === GetWalkUseCaseCodes.NOT_EXIST_WALK) {
            throw new HttpException(getWalkUseCaseResponse.code, StatusCodes.NOT_FOUND);
        }
        
        if (getWalkUseCaseResponse.code !== GetWalkUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO FIND WALK', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const walk: WalkDetailDto = {
            id: getWalkUseCaseResponse.walk.id,
            finishStatus: getWalkUseCaseResponse.walk.finishStatus,
            distance: getWalkUseCaseResponse.walk.distance.value,
            time: getWalkUseCaseResponse.walk.time.value,
            pinCount: getWalkUseCaseResponse.walk.pinCount.value,
            title: getWalkUseCaseResponse.walk.walkway.title.value,
            image: getWalkUseCaseResponse.walk.walkway.image ? getWalkUseCaseResponse.walk.walkway.image.value : null,
            walkwayId: getWalkUseCaseResponse.walk.walkway.id,
            createdAt: getWalkUseCaseResponse.walk.createdAt,
        };

        return {
            walk,
        };
    }

    @Patch('/:walkwayId')
    @UseGuards(WalkwayOwnerGuard)
    @UseGuards(JwtAuthGuard)
    @HttpCode(StatusCodes.OK)
    @ApiResponse({
        type: GetWalkwayResponse,
    })
    @ApiOperation({
        summary: '산책로 수정',
        description: '수정된 결과를 리턴할 때, 경로의 양 끝점 중 현 위치에서 가까운 점을 startPoint로 설정하기 위해 현 위치를 query로 받음.'
    })
    async update(
        @Body() body: UpdateWalkwayRequest,
        @Param('walkwayId') walkwayId: string,
        @Query('lat', new DefaultValuePipe(37.5666805), ParseFloatPipe) lat: number=37.5666805,
        @Query('lng', new DefaultValuePipe(126.9784147), ParseFloatPipe) lng: number=126.9784147,
    ): Promise<GetWalkwayResponse> {
        const updateWalkwayUseCaseResponse = await this.updateWalkwayUseCase.execute({
            id: walkwayId,
            title: body.title,
            image: body.image,
            status: body.status,
        });

        if (updateWalkwayUseCaseResponse.code !== UpdateWalkwayUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO UPDATE WALKWAY', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const walkway = await this.convertToWalkwayDto(updateWalkwayUseCaseResponse.walkway, lat, lng);

        return {
            walkway,
        };
    }

    @Patch('/walks/:walkId')
    @UseGuards(JwtAuthGuard)
    @UseGuards(WalkOwnerGuard)
    @ApiResponse({
        type: CommonResponse,
    })
    async updateWalk(
        @Body() request: UpdateWalkRequest,
    ): Promise<CommonResponse> {
        // TODO: 차후 Usecase 생성시 추가
        throw new Error('Method not implemented');
    }

    @Delete('/:walkwayId')
    @UseGuards(WalkwayOwnerGuard)
    @UseGuards(JwtAuthGuard)
    @ApiResponse({
        type: CommonResponse,
    })
    @ApiOperation({
        summary: '산책로 삭제',
    })
    async delete(
        @Param('walkwayId') walkwayId: string,
    ): Promise<CommonResponse> {
        const deleteWalkwayUseCaseResponse = await this.deleteWalkwayUseCase.execute({
            id: walkwayId,
        });

        if (deleteWalkwayUseCaseResponse.code === DeleteWalkwayUseCaseCodes.NOT_EXIST_WALKWAY) {
            throw new HttpException(DeleteWalkwayUseCaseCodes.NOT_EXIST_WALKWAY, StatusCodes.NOT_FOUND);
        }

        if (deleteWalkwayUseCaseResponse.code !== DeleteWalkwayUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO DELETE WALKWAY', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        return {
            code: StatusCodes.NO_CONTENT,
            responseMessage: 'SUCCESS TO DELETE WALKWAY',
        };
    }

    @Delete('/walks/:walkId')
    @UseGuards(JwtAuthGuard)
    @UseGuards(WalkOwnerGuard)
    @ApiResponse({
        type: CommonResponse,
    })
    async deleteWalk() {
        // TODO: 차후 Usecase 생성시 추가
        throw new Error('Method not implemented');
    }
}
