import _ from 'lodash';
import { StatusCodes } from 'http-status-codes';
import { Body, Controller, Delete, Get, HttpCode, HttpException, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CommonResponse } from '../../common/controller/dto/CommonResponse';
import { CreateCommentRequest, CreatePinRequest, UpdateCommentReqeust, UpdatePinRequest } from './dto/PinRequest';
import { CommentDto, GetAllCommentResponse, GetAllPinResponse, GetPinResponse } from './dto/PinResponse';
import { GetAllPinUseCase, GetAllPinUseCaseCodes } from '../application/GetAllPinUseCase/GetAllPinUseCase';
import { GetUserUseCase, GetUserUseCaseCodes } from '../../user/application/GetUserUseCase/GetUserUseCase';
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
        private readonly updatePinUseCase: UpdatePinUseCase,
    ) {}

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
        summary: '핀 목록 조회',
        description: 'pinId에 해당하는 핀의 모든 댓글 리턴.'
    })
    @HttpCode(StatusCodes.OK)
    @ApiOkResponse({
        type: GetAllCommentResponse,
    })
    async getAllComment(
        @Query('pinId') pinId: string,
    ): Promise<GetAllCommentResponse> {
        const getAllCommentUseCaseResponse = await this.getAllCommentUseCase.execute({
            pinId,
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
    @UseGuards(JwtAuthGuard)
    @UseGuards(CommentOwnerGuard)
    @HttpCode(StatusCodes.NO_CONTENT)
    @ApiResponse({
        type: CommonResponse
    })
    async deleteComment(
        @Query('commentId') commentId: string,
    ): Promise<CommonResponse> {
        // TODO: 차후 UseCase 생성 시 추가
        throw new Error('Method not implemented');
    }

    @Delete('/:pinId')
    @UseGuards(JwtAuthGuard)
    @UseGuards(PinOwnerGuard)
    @HttpCode(StatusCodes.NO_CONTENT)
    @ApiResponse({
        type: CommonResponse,
    })
    async delete(
        @Param('pinId') pinId: string,
    ): Promise<CommonResponse> {
        // TODO: 차후 Usecase 생성시 추가
        throw new Error('Method not implemented');
    }
}
