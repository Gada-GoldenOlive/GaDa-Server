import _ from 'lodash';
import { StatusCodes } from 'http-status-codes';
import { Body, Controller, DefaultValuePipe, Delete, Get, HttpCode, HttpException, Param, ParseIntPipe, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CommonResponse } from '../../common/controller/dto/CommonResponse';
import { CreateCommentRequest, CreatePinRequest, UpdateCommentReqeust, UpdatePinRequest } from './dto/PinRequest';
import { CommentDto, GetAllCommentResponse, GetAllPinResponse, GetPinResponse } from './dto/PinResponse';
import { GetAllPinUseCase, GetAllPinUseCaseCodes } from '../application/GetAllPinUseCase/GetAllPinUseCase';
import { GetUserUseCase } from '../../user/application/GetUserUseCase/GetUserUseCase';
import { GetWalkwayUseCase, GetWalkwayUseCaseCodes } from '../../walkway/application/GetWalkwayUseCase/GetWalkwayUseCase';
import { IGetAllPinUseCaseResponse } from '../application/GetAllPinUseCase/dto/IGetAllPinUseCaseResponse';
import { CreatePinUseCase, CreatePinUseCaseCodes } from '../application/CreatePinUseCase/CreatePinUseCase';
import { GetPinUseCase, GetPinUseCaseCodes } from '../application/GetPinUseCase/GetPinUseCase';
import { CreateCommentUseCase, CreateCommentUseCaseCodes } from '../application/CreateCommentUseCase/CreateCommentUseCase';
import { PinOwnerGuard } from '../pin-owner.guard';
import { CommentOwnerGuard } from '../comment-owner.guard';
import { JwtAuthGuard } from '../../auth/jwt-auth.gaurd';
import { UserStatus } from '../../user/domain/User/UserStatus';
import { GetAllCommentUseCase, GetAllCommentUseCaseCodes } from '../application/GetAllCommentUseCase/GetAllCommentUseCase';
import { Achieve } from '../../badge/domain/Achieve/Achieve';
import { BadgeCategory, BADGE_CATEGORY } from '../../badge/domain/Badge/BadgeCategory';
import { BadgeCode, BADGE_CODE } from '../../badge/domain/Badge/BadgeCode';
import { GetAchieveUseCase, GetAchieveUseCaseCodes } from '../../badge/application/GetAchieveUseCase/GetAchieveUseCase';
import { UpdateAchieveUseCase, UpdateAchieveUseCaseCodes } from '../../badge/application/UpdateAchieveUseCase/UpdateAchieveUseCase';
import { User } from '../../user/domain/User/User';
import { AchieveStatus } from '../../badge/domain/Achieve/AchieveStatus';
import { DeletePinUseCase, DeletePinUseCaseCodes } from '../application/DeletePinUseCase/DeletePinUseCase';
import { DeleteCommentUseCase, DeleteCommentUseCaseCodes } from '../application/DeleteCommentUseCase/DeleteCommentUseCase';
import { UpdatePinUseCase, UpdatePinUseCaseCodes } from '../application/UpdatePinUseCase/UpdatePinUseCase';

@Controller('pins')
@ApiTags('핀')
export class PinController {
    constructor(
        private readonly getAllPinUseCase: GetAllPinUseCase,
        private readonly getUserUseCase: GetUserUseCase,
        private readonly getWalkwayUseCase: GetWalkwayUseCase,
        private readonly createPinUseCase: CreatePinUseCase,
        private readonly getPinUseCase: GetPinUseCase,
        private readonly createCommentUseCase: CreateCommentUseCase,
        private readonly getAllCommentUseCase: GetAllCommentUseCase,
        private readonly getAchieveUseCase: GetAchieveUseCase,
        private readonly updateAchieveUseCase: UpdateAchieveUseCase,
        private readonly deletePinUseCase: DeletePinUseCase,
        private readonly deleteCommentUseCase: DeleteCommentUseCase,
        private readonly updatePinUseCase: UpdatePinUseCase,
    ) {}

    private achieves: Achieve[] = [];

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

    @Post()
    @UseGuards(JwtAuthGuard)
    @HttpCode(StatusCodes.CREATED)
    @ApiCreatedResponse({
        type: CommonResponse,
    })
    @ApiOperation({
        summary: '핀 생성',
    })
    async create(
        @Request() request,
        @Body() body: CreatePinRequest,
    ): Promise<CommonResponse> {
        this.achieves = [];

        const walkwayResponse = await this.getWalkwayUseCase.execute({
            id: body.walkwayId,
        });

        if (walkwayResponse.code !== GetWalkwayUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO CREATE PIN BY WALKWAY', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const createPinUseCaseResponse = await this.createPinUseCase.execute({
            title: body.title,
            content: body.content,
            image: body.image,
            location: body.location,
            walkway: walkwayResponse.walkway,
            user: request.user,
        });

        if (createPinUseCaseResponse.code !== CreatePinUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO CREATE PIN', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const getAllPinUseCaseResponse = await this.getAllPinUseCase.execute({
            user: request.user,
        });

        if (getAllPinUseCaseResponse.code !== GetAllPinUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO GET ALL PIN', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const pins = getAllPinUseCaseResponse.pins;

        if (pins.length >= 100) {
            await this.pushAchieve(request.user, BadgeCategory.PIN, BadgeCode.HUNDRED, this.achieves);
        }
        if (pins.length >= 20) {
            await this.pushAchieve(request.user, BadgeCategory.PIN, BadgeCode.TWENTY, this.achieves);
        }
        if (pins.length >= 10) {
            await this.pushAchieve(request.user, BadgeCategory.PIN, BadgeCode.TEN, this.achieves);
        }
        if (pins.length >= 5) {
            await this.pushAchieve(request.user, BadgeCategory.PIN, BadgeCode.FIVE, this.achieves);
        }
        if (pins.length >= 3) {
            await this.pushAchieve(request.user, BadgeCategory.PIN, BadgeCode.THREE, this.achieves);
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
                responseMessage: 'SUCCESS TO CREATE PIN AND GET BADGE',
                achieves: _.map(this.achieves, (achieve) => {
                    return {
                        badge: {
                            title: achieve.badge.title.value,
                            image: achieve.badge.image.value,
                        },
                        status: achieve.status,
                    };
                }),
            };
        }
        
        return {
            code: StatusCodes.CREATED,
            responseMessage: 'SUCCESS TO CREATE PIN',
        };

    }

    @Post('/comments')
    @UseGuards(JwtAuthGuard)
    @HttpCode(StatusCodes.CREATED)
    @ApiCreatedResponse({
        type: CommonResponse,
    })
    @ApiOperation({
        summary: '댓글 생성',
    })
    async createComment(
        @Request() request,
        @Body() body: CreateCommentRequest,
    ): Promise<CommonResponse> {
        this.achieves = [];
        
        const pinResponse = await this.getPinUseCase.execute({
            id: body.pinId,
        });

        if (pinResponse.code !== GetPinUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO CREATE COMMENT BY PIN', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const createCommentUseCaseResponse = await this.createCommentUseCase.execute({
            content: body.content,
            pin: pinResponse.pin,
            user: request.user,
        });

        if (createCommentUseCaseResponse.code !== CreateCommentUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO CREATE COMMENT', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const getAllCommentUseCaseResponse = await this.getAllCommentUseCase.execute({
            user: request.user,
        });

        if (getAllCommentUseCaseResponse.code !== GetAllCommentUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO GET ALL COMMENT', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const comments = getAllCommentUseCaseResponse.comments;

        if (comments.length >= 100) {
            await this.pushAchieve(request.user, BadgeCategory.COMMENT, BadgeCode.HUNDRED, this.achieves);
        }
        if (comments.length >= 20) {
            await this.pushAchieve(request.user, BadgeCategory.COMMENT, BadgeCode.TWENTY, this.achieves);
        }
        if (comments.length >= 10) {
            await this.pushAchieve(request.user, BadgeCategory.COMMENT, BadgeCode.TEN, this.achieves);
        }
        if (comments.length >= 5) {
            await this.pushAchieve(request.user, BadgeCategory.COMMENT, BadgeCode.FIVE, this.achieves);
        }
        if (comments.length >= 3) {
            await this.pushAchieve(request.user, BadgeCategory.COMMENT, BadgeCode.THREE, this.achieves);
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
                responseMessage: 'SUCCESS TO CREATE COMMENT AND GET BADGE',
                achieves: _.map(this.achieves, (achieve) => {
                    return {
                        badge: {
                            title: achieve.badge.title.value,
                            image: achieve.badge.image.value,
                        },
                        status: achieve.status,
                    };
                }),
            };
        }

        return {
            code: StatusCodes.CREATED,
            responseMessage: 'SUCCESS TO CREATE COMMENT',
        };
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: '산책로 또는 유저의 핀 목록 조회',
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

        if (walkwayResponse.walkway && userResponse.user) {
            throw new HttpException('산책로 아이디, 유저 아이디 둘 중 하나만 보내주세요', StatusCodes.BAD_REQUEST);
        }

        if (walkwayResponse.walkway && !userResponse.user) {
            getAllPinUseCaseResponse = await this.getAllPinUseCase.execute({
                walkway: walkwayResponse.walkway,
                curLocation: {
                    lat,
                    lng,
                },
            });
        };

        if (!walkwayResponse.walkway && userResponse.user) {
            getAllPinUseCaseResponse = await this.getAllPinUseCase.execute({
                user: userResponse.user,
            });
        }

        if (!walkwayResponse.walkway && !userResponse.user) {
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
            userId: pin.user.status === UserStatus.NORMAL ? pin.user.id : '  ',
            walkwayId: pin.walkway.id,
            createdAt: pin.createdAt,
            updatedAt: pin.updatedAt,
        }));

        return {
            pins,
        };
    }

    @Get('/comments')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: '댓글 목록 조회',
        description: 'pinId에 해당하는 핀의 모든 댓글 리턴.'
        + 'page는 page index, 1부터 시작 (default: 1)<br>'
        + 'limit는 한 페이지 내의 아이템 수 (default: 10)'
    })
    @HttpCode(StatusCodes.OK)
    @ApiOkResponse({
        type: GetAllCommentResponse,
    })
    async getAllComment(
        @Query('pinId') pinId: string,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
        ): Promise<GetAllCommentResponse> {
            const getAllCommentUseCaseResponse = await this.getAllCommentUseCase.execute({
                pinId,
                paginationOptions: {
                    page,
                    limit,
                    route: 'http://15.165.77.113:3000/pins/comments',
                },
            });

        if (getAllCommentUseCaseResponse.code !== GetAllCommentUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO GET COMMENT', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const comments: CommentDto[] = _.map(getAllCommentUseCaseResponse.comments, function(comment): CommentDto {
            return {
                id: comment.id,
                content: comment.content.value,
                creator: comment.user.name.value,
                creatorId: comment.user.id,
                createdAt: comment.createdAt,
                updatedAt: comment.updatedAt,
            };
        });

        return {
            comments,
            meta: getAllCommentUseCaseResponse.meta,
            links: getAllCommentUseCaseResponse.links,
        };
    }

    @Get('/:pinId')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({
        type: GetPinResponse,
    })
    @ApiOperation({
        summary: '개별 핀 정보 조회',
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

        const foundPin = getPinUseCaseResponse.pin;

        let userId = foundPin.user.id;

        if (foundPin.user.status === UserStatus.DELETE) {
            userId = 'jonjaehaji-aneum';
        }

        const pin = {
            id: foundPin.id,
            title: foundPin.title.value,
            content: foundPin.content.value,
            image: foundPin.image ? foundPin.image.value : null,
            location: foundPin.location.value,
            userId,
            walkwayId: foundPin.walkway.id,
            createdAt: foundPin.createdAt,
            updatedAt: foundPin.updatedAt,
        };

        return {
            pin,
        };
    }

    @Patch('/comments/:commentId')
    @UseGuards(JwtAuthGuard)
    @UseGuards(CommentOwnerGuard)
    @HttpCode(StatusCodes.NO_CONTENT)
    @ApiResponse({
        type: CommonResponse,
    })
    async updateComment(
        @Body() request: UpdateCommentReqeust,
    ): Promise<CommonResponse> {
        // TODO: 차후 UseCase 생성 시 추가
        throw new Error('Method not implemented');
    }

    @Patch('/:pinId')
    @UseGuards(PinOwnerGuard)
    @UseGuards(JwtAuthGuard)
    @HttpCode(StatusCodes.NO_CONTENT)
    @ApiResponse({
        type: GetPinResponse,
    })
    @ApiOperation({
        summary: '핀 수정',
    })
    async update(
        @Body() body: UpdatePinRequest,
        @Param('pinId') pinId: string,
    ): Promise<GetPinResponse> {
        const updatePinUseCaseResponse = await this.updatePinUseCase.execute({
            id: pinId,
            title: body.title,
            content: body.content,
            image: body.image,
        });

        if (updatePinUseCaseResponse.code !== UpdatePinUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO UPDATE PIN', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const foundPin = updatePinUseCaseResponse.pin;

        let userId = foundPin.user.id;

        if (foundPin.user.status === UserStatus.DELETE) {
            userId = 'jonjaehaji-aneum';
        }

        const pin = {
            id: foundPin.id,
            title: foundPin.title.value,
            content: foundPin.content.value,
            image: foundPin.image ? foundPin.image.value : null,
            location: foundPin.location.value,
            userId,
            walkwayId: foundPin.walkway.id,
            createdAt: foundPin.createdAt,
            updatedAt: foundPin.updatedAt,
        };

        return {
            pin,
        };
    }

    @Delete('/comments/:commentId')
    @UseGuards(CommentOwnerGuard)
    @UseGuards(JwtAuthGuard)
    @HttpCode(StatusCodes.NO_CONTENT)
    @ApiResponse({
        type: CommonResponse
    })
    @ApiOperation({
        summary: '댓글 삭제',
    })
    async deleteComment(
        @Param('commentId') commentId: string,
    ): Promise<CommonResponse> {
        const deleteCommentUseCaseResponse = await this.deleteCommentUseCase.execute({
            id: commentId,
        });

        if (deleteCommentUseCaseResponse.code !== DeleteCommentUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO DELTE COMMENT', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        return {
            code: StatusCodes.NO_CONTENT,
            responseMessage: 'SUCCESS TO DELETE COMMENT',
        };
    }

    @Delete('/:pinId')
    @UseGuards(PinOwnerGuard)
    @UseGuards(JwtAuthGuard)
    @HttpCode(StatusCodes.NO_CONTENT)
    @ApiResponse({
        type: CommonResponse,
    })
    @ApiOperation({
        summary: '핀 삭제',
    })
    async delete(
        @Param('pinId') pinId: string,
    ): Promise<CommonResponse> {
        const deletePinUseCaseResponse = await this.deletePinUseCase.execute({
            id: pinId,
        });

        if (deletePinUseCaseResponse.code !== DeletePinUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO DELETE PIN', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        return {
            code: StatusCodes.NO_CONTENT,
            responseMessage: 'SUCCESS TO DELETE PIN',
        };
    }
}
