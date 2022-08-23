import _ from 'lodash';
import { Body, Controller, Delete, Get, HttpCode, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';

import { CommonResponse } from '../../common/controller/dto/CommonResponse';
import { GetAllUserResponse } from './dto/UserResponse';
import { CreateFriendRequest } from './dto/FriendRequest';

@Controller('friends')
@ApiTags('친구')
export class FriendController {
    constructor() {}

    @Post()
    @HttpCode(StatusCodes.CREATED)
    @ApiCreatedResponse({
        type: CommonResponse,
    })
    async create(
        @Body() request: CreateFriendRequest,
    ): Promise<CommonResponse> {
        // TODO: 차후 UseCase 생성 시 추가
        throw new Error('Method not implemented');
    }

    @Get('/:userId')
    @HttpCode(StatusCodes.OK)
    @ApiOkResponse({
        type: GetAllUserResponse,
    })
    @ApiOperation({
        description: 'userId에 해당하는 유저의 친구 목록 리턴'
    })
    async getAll() {
        // TODO: 차후 Usecase 생성시 추가
        throw new Error('Method not implemented');

    }

    @Delete('/:userId/:friendId')
	@HttpCode(StatusCodes.NO_CONTENT)
	@ApiResponse({
		type: CommonResponse
	})
	async delete(
		@Param('userId') userId: string,
        @Param('friendId') friendId: string
	): Promise<CommonResponse> {
		// TODO: 차후 UseCase 생성 시 추가
		throw new Error('Method not implemented');
	}
}
