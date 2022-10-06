import { Body, Controller, Delete, Get, HttpCode, HttpException, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';

import { JwtAuthGuard } from '../../auth/jwt-auth.gaurd';
import { CommonResponse } from '../../common/controller/dto/CommonResponse';
import { AchieveOwnerGuard } from '../achieve-owner.guard';
import { CreateBadgeUseCase, CreateBadgeUseCaseCodes } from '../application/CreateBadgeUseCase/CreateBadgeUseCase';
import { GetAllBadgeUseCase, GetAllBadgeUseCaseCodes } from '../application/GetAllBadgeUseCase/GetAllBadgeUseCase';
import { BadgeCategory } from '../domain/Badge/BadgeCategory';
import { BadgeCode } from '../domain/Badge/BadgeCode';
import { BadgeOwnerGuard } from '../badge-owner.guard';
import { CreateAchieveRequest, CreateAllBadgeRequest, CreateBadgeRequest, UpdateAchieveRequest, UpdateBadgeReqeust } from './dto/BadgeRequest';
import { GetAllBadgeResponse } from './dto/BadgeResponse';
import { CreateAllBadgeUseCase, CreateAllBadgeUseCaseCodes } from '../application/CreateAllBadgeUseCase/CreateAllBadgeUseCase';

@Controller('badges')
@ApiTags('배지')
export class BadgeController {
	constructor(
		private readonly createBadgeUseCase: CreateBadgeUseCase,
		private readonly getAllBadgeUseCase: GetAllBadgeUseCase,
		private readonly createAllBadgeUseCase: CreateAllBadgeUseCase,
	) {}

	@Post()
	@HttpCode(StatusCodes.CREATED)
	@ApiCreatedResponse({
		type: CommonResponse,
	})
	@ApiOperation({
		summary: '배지 하나 생성(백엔드 용, 프론트는 쓸 일X)'
	})
	async create(
		@Body() request: CreateBadgeRequest,
	): Promise<CommonResponse> {
		const createBadgeUseCaseResponse = await this.createBadgeUseCase.execute({
			title: request.badge.title,
			image: request.badge.image,
			category: request.badge.category,
			code: request.badge.code,
		});

		if (createBadgeUseCaseResponse.code !== CreateBadgeUseCaseCodes.SUCCESS) {
			throw new HttpException('FAIL TO CREATE BADGE', StatusCodes.INTERNAL_SERVER_ERROR);
		}

		return {
			code: StatusCodes.CREATED,
			responseMessage: 'SUCCESS TO CREATE BADGE',
		};
	}

	@Post('/all')
	@ApiCreatedResponse({
		type: CommonResponse,
	})
	@ApiOperation({
		summary: '배지 한 번에 생성(백엔드 용, 프론트는 쓸 일X)'
	})
	async createAll(
		@Body() request: CreateAllBadgeRequest,
	): Promise<CommonResponse> {
		const createAllBadgeUseCaseResponse = await this.createAllBadgeUseCase.execute({
			badges: request.badges,
		});

		if (createAllBadgeUseCaseResponse.code !== CreateAllBadgeUseCaseCodes.SUCCESS) {
			throw new HttpException('FAIL TO CREATE ALL BADGE', StatusCodes.INTERNAL_SERVER_ERROR);
		}

		return {
			code: StatusCodes.CREATED,
			responseMessage: 'SUCCESS TO CREATE BADGE',
		};
	}

	@Post('/achievement')
    @UseGuards(JwtAuthGuard)
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
    @UseGuards(JwtAuthGuard)
	@ApiOperation({
		description: 'query로 요청한 category 혹은 code에 해당하는 배지 모두 리턴'
	})
	@HttpCode(StatusCodes.OK)
	@ApiOkResponse({
		type: GetAllBadgeResponse,
	})
	async getAll(
		@Query('category') category?: string, // NOTE: 요청한 category에 속하는 배지들 불러오기
		@Query('code') code?: string, // NOTE: 요청한 code에 속하는 배지들 불러오기
	): Promise<GetAllBadgeResponse> {
		const getAllBadgeUseCaseResponse = await this.getAllBadgeUseCase.execute({
			category: category as BadgeCategory,
			code: code as BadgeCode,
		});

		if (getAllBadgeUseCaseResponse.code !== GetAllBadgeUseCaseCodes.SUCCESS) {
			throw new HttpException('FAIL TO GET ALL BADGES', StatusCodes.INTERNAL_SERVER_ERROR);
		}

		const badges = _.map(getAllBadgeUseCaseResponse.badges, (badge) => ({
			id: badge.id,
			title: badge.title.value,
			image: badge.image.value,
			category: badge.category,
			code: badge.code,
			createdAt: badge.createdAt,
			updatedAt: badge.updatedAt,
		}));

		return {
			badges,
		};
	}

	@Get('/:userId')
	@ApiOperation({
		description: 'userId로 보낸 유저의 전체 배지 리턴'
	})
	@HttpCode(StatusCodes.OK)
	@ApiResponse({
		type: GetAllBadgeResponse,
	})
	async getAllMyBadge(
		@Param('userId') userId?: string,
	): Promise<GetAllBadgeResponse> {
		// TODO: 차후 UseCase 생성 시 추가
		throw new Error('Method not implemented');
	}

	@Patch('/:badgeId')
    @UseGuards(JwtAuthGuard)
    @UseGuards(BadgeOwnerGuard)
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
    @UseGuards(JwtAuthGuard)
    @UseGuards(AchieveOwnerGuard)
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
    @UseGuards(JwtAuthGuard)
    @UseGuards(BadgeOwnerGuard)
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
    @UseGuards(JwtAuthGuard)
    @UseGuards(AchieveOwnerGuard)
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
