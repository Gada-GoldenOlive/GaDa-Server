import _ from 'lodash';
import { Body, Controller, Delete, Get, HttpCode, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';

import { CommonResponse } from '../../common/controller/dto/CommonResponse';
import { GetAllReviewResponse } from './dto/ReviewResponse';
import { CreateLikeRequest } from './dto/LikeRequest';

@Controller('likes')
@ApiTags('좋아요')
export class LikeController {
    constructor() {}

    @Post()
    @HttpCode(StatusCodes.CREATED)
    @ApiCreatedResponse({
        type: CommonResponse,
    })
    async create(
        @Body() request: CreateLikeRequest,
    ): Promise<CommonResponse> {
        // TODO: 차후 UseCase 생성 시 추가
        throw new Error('Method not implemented');
    }

    @Get('/:userId')
    @HttpCode(StatusCodes.OK)
    @ApiOkResponse({
        type: GetAllReviewResponse,
    })
    @ApiOperation({
        description: 'userId에 해당하는 유저가 좋아요 누른 리뷰 목록 리턴'
    })
    async getAll() {
        // TODO: 차후 Usecase 생성시 추가
        throw new Error('Method not implemented');

    }

    @Delete('/:userId/:reviewId')
	@HttpCode(StatusCodes.NO_CONTENT)
	@ApiResponse({
		type: CommonResponse
	})
	async delete(
		@Param('userId') userId: string,
        @Param('reviewId') reviewId: string
	): Promise<CommonResponse> {
		// TODO: 차후 UseCase 생성 시 추가
		throw new Error('Method not implemented');
	}
}