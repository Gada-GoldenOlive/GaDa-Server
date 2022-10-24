import { Body, Controller, Delete, Get, HttpCode, HttpException, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
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
import { AchieveDto, GetAllAchieveResponse, GetAllBadgeResponse } from './dto/BadgeResponse';
import { CreateAllBadgeUseCase, CreateAllBadgeUseCaseCodes } from '../application/CreateAllBadgeUseCase/CreateAllBadgeUseCase';
import { GetAllAchieveUseCase, GetAllAchieveUseCaseCodes } from '../application/GetAllAchieveUseCase/GetAllAchieveUseCase';

@Controller('badges')
@ApiTags('배지')
export class BadgeController {
	constructor(
		private readonly createBadgeUseCase: CreateBadgeUseCase,
		private readonly getAllBadgeUseCase: GetAllBadgeUseCase,
		private readonly createAllBadgeUseCase: CreateAllBadgeUseCase,
		private readonly getAllAchieveUseCase: GetAllAchieveUseCase,
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
		summary: '배지들 리턴 (백엔드 용, 프론트는 쓸 일 X)',
		description: 'query로 요청한 category 혹은 code에 해당하는 배지 모두 리턴<br>'
		+ '- category, code 둘 중 하나만 보내도 되고 둘 다 보내도 됨'
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

	@Get('/list')
	@UseGuards(JwtAuthGuard)
	@ApiOperation({
		summary: '토큰으로 보낸 유저의 전체 배지 리턴',
		description: '[리턴되는 것]<br>'
		+ '- status: 배지의 상태 (non_achieve: 획득 전, achieve: 획득)<br>'
		+ '- 히든 배지는 리턴되지 않음'
	})
	@HttpCode(StatusCodes.OK)
	@ApiResponse({
		type: GetAllAchieveResponse,
	})
	async getAllMyBadge(
		@Request() request,
	): Promise<GetAllAchieveResponse> {
		const user = request.user;

		const getAllAchieveUSeCaseResponse = await this.getAllAchieveUseCase.execute({
			user,
		});

		if (getAllAchieveUSeCaseResponse.code !== GetAllAchieveUseCaseCodes.SUCCESS) {
			throw new HttpException('FAIL TO GET ALL USER BADGE', StatusCodes.INTERNAL_SERVER_ERROR);
		}

		const achieves = getAllAchieveUSeCaseResponse.achieves;

		const userBadges: AchieveDto[] = _.map(achieves, (achieve) => {
			return {
				badge: {
					title: achieve.badge.title.value,
					image: achieve.badge.image.value,
				},
				status: achieve.status,
			};
		});

		return {
			userBadges,
		};
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

	// NOTE: 근데 이거 필요 없을 거 같음 그냥 우리가 다른 api에서 달성한 achieve 생기면 거기서 바꿔주면 될듯 삭제해두 될거가틈
	@Patch('/achievement/:achieveId')
    @UseGuards(JwtAuthGuard)
    @UseGuards(AchieveOwnerGuard)
	@HttpCode(StatusCodes.NO_CONTENT)
	@ApiOperation({
		summary: 'achieve의 상태값수정. NON_ACHIEVE나 HIDDEN을 ACHIEVE로 변경할 때 사용하는 API'
	})
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
