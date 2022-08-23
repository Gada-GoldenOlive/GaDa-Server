import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';

import { CommonResponse } from '../../common/controller/dto/CommonResponse';
import { GetAllCommentResponse } from './dto/CommentResponse';
import { CreateCommentRequest, UpdateCommentReqeust } from './dto/CommntRequest';

@Controller('comment')
@ApiTags('댓글')
export class CommentController {
	constructor() {}

	@Post()
	@HttpCode(StatusCodes.CREATED)
	@ApiCreatedResponse({
		type: CommonResponse,
	})
	async create(
		@Body() request: CreateCommentRequest,
	): Promise<CommonResponse> {
		// TODO: 차후 UseCase 생성 시 추가
		throw new Error('Method not implemented');
	}

	@Get()
	@ApiOperation({
		description: "query parameter로 userId만 보낼 경우: 해당하는 유저의 모든 댓글 리턴. || pinId만 보낼 경우: 해당하는 핀의 모든 댓글 리턴."
	})
	@HttpCode(StatusCodes.OK)
	@ApiOkResponse({
		type: GetAllCommentResponse,
	})
	async getAll(
		@Query('userId') userId?: string, // NOTE: 해당하는 유저의 모든 댓글 불러오기
        @Query('pinId') pinId?: string, // NOTE: 해당하는 핀의 모든 댓글 불러오기
	): Promise<GetAllCommentResponse> {
		// TODO: 차후 UseCase 생성 시 추가
		throw new Error('Method not implemented');
	}

	@Patch('/:commentId')
	@HttpCode(StatusCodes.NO_CONTENT)
	@ApiResponse({
		type: CommonResponse,
	})
	async update(
		@Body() request: UpdateCommentReqeust,
		@Param('badgeId') badgeId: string,
	): Promise<CommonResponse> {
		// TODO: 차후 UseCase 생성 시 추가
		throw new Error('Method not implemented');
	}

	@Delete('/:commentId')
	@HttpCode(StatusCodes.NO_CONTENT)
	@ApiResponse({
		type: CommonResponse
	})
	async delete(
		@Param('commentId') commentId: string,
	): Promise<CommonResponse> {
		// TODO: 차후 UseCase 생성 시 추가
		throw new Error('Method not implemented');
	}
}
