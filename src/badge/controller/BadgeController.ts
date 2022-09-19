import { Body, Controller, Delete, Get, HttpCode, HttpException, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';

import { CommonResponse } from '../../common/controller/dto/CommonResponse';
import { CreateBadgeUseCase, CreateBadgeUseCaseCodes } from '../application/CreateBadgeUseCase/CreateBadgeUseCase';
import { CreateAchieveRequest, CreateBadgeRequest, UpdateAchieveRequest, UpdateBadgeReqeust } from './dto/BadgeRequest';
import { GetAllBadgeResponse } from './dto/BadgeResponse';

@Controller('badges')
@ApiTags('배지')
export class BadgeController {
	constructor(
		private readonly createBadgeUseCase: CreateBadgeUseCase,
	) {}

	@Post()
	@HttpCode(StatusCodes.CREATED)
	@ApiCreatedResponse({
		type: CommonResponse,
	})
	@ApiOperation({
		summary: '배지 생성(백엔드 용, 프론트는 쓸 일X)'
	})
	async create(
		@Body() request: CreateBadgeRequest,
	): Promise<CommonResponse> {
		const createBadgeUseCaseResponse = await this.createBadgeUseCase.execute({
			title: request.title,
			image: request.image,
		});

		if (createBadgeUseCaseResponse.code !== CreateBadgeUseCaseCodes.SUCCESS) {
			throw new HttpException('FAIL TO CREATE BADGE', StatusCodes.INTERNAL_SERVER_ERROR);
		}

		return {
			code: StatusCodes.CREATED,
			responseMessage: 'SUCCESS TO CREATE BADGE',
		};
	}

	@Post('/achievement')
	@HttpCode(StatusCodes.CREATED)
	@ApiCreatedResponse({
		type: CommonResponse,
	})
	async achieve(
		@Body() request: CreateAchieveRequest,
	): Promise<CommonResponse> {
		// TODO: 차후 UseCase 생성 시 추가
        throw new Error('Method not implemented');
	}

	@Get()
	@ApiOperation({
		description: 'userId query parameter로 보낼 경우: 해당하는 유저의 모든 배지 리턴. || 안 보낼 경우: 모든 배지 리턴.'
	})
	@HttpCode(StatusCodes.OK)
	@ApiOkResponse({
		type: GetAllBadgeResponse,
	})
	async getAll(
		@Query('userId') userId?: string, // NOTE: 해당하는 유저의 모든 배지 불러오기
	): Promise<GetAllBadgeResponse> {
		// TODO: 차후 UseCase 생성 시 추가
		throw new Error('Method not implemented');
	}

	@Patch('/:badgeId')
	@HttpCode(StatusCodes.NO_CONTENT)
	@ApiResponse({
		type: CommonResponse,
	})
	async update(
		@Body() request: UpdateBadgeReqeust,
		@Param('badgeId') badgeId: string,
	): Promise<CommonResponse> {
		// TODO: 차후 UseCase 생성 시 추가
		throw new Error('Method not implemented');
	}

	@Patch('/achievement/:achieveId')
	@HttpCode(StatusCodes.NO_CONTENT)
	@ApiResponse({
		type: CommonResponse,
	})
	async updateAchievement(
		@Body() request: UpdateAchieveRequest,
		@Param('achieveId') achieveId: string,
	): Promise<CommonResponse> {
		// TODO: 차후 UseCase 생성 시 추가
		throw new Error('Method not implemented');
	}

	@Delete('/:badgeId')
	@HttpCode(StatusCodes.NO_CONTENT)
	@ApiResponse({
		type: CommonResponse
	})
	async delete(
		@Param('badgeId') badgeId: string,
	): Promise<CommonResponse> {
		// TODO: 차후 UseCase 생성 시 추가
		throw new Error('Method not implemented');
	}

	@Delete('/achievement/:achieveId')
	@HttpCode(StatusCodes.NO_CONTENT)
	@ApiResponse({
		type: CommonResponse
	})
	async deleteAchivement(
		@Param('achieveId') achieveId: string,
	): Promise<CommonResponse> {
		// TODO: 차후 UseCase 생성 시 추가
		throw new Error('Method not implemented');
	}
}
