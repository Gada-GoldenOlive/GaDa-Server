import _ from 'lodash';
import { StatusCodes } from 'http-status-codes';
import { Body, Controller, Delete, Get, HttpCode, HttpException, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CommonResponse } from '../../common/controller/dto/CommonResponse';
import { GetUserUseCase } from '../../user/application/GetUserUseCase/GetUserUseCase';
import { GetAllReviewUseCase, GetAllReviewUseCaseCodes } from '../application/GetAllReviewUseCase/GetAllReviewUseCase';
import { CreateReviewRequest, UpdateReviewRequest } from './dto/ReviewRequest';
import { GetAllReviewResponse } from './dto/ReviewResponse';
import { GetWalkwayUseCase } from '../../walkway/application/GetWalkwayUseCase/GetWalkwayUseCase';
import { IGetAllReviewUseCaseResponse } from '../application/GetAllReviewUseCase/dto/IGetAllReviewUseCaseResponse';
import { CreateLikeRequest } from './dto/LikeRequest';

@Controller('reviews')
@ApiTags('리뷰')
export class ReviewController {
    constructor(
        private readonly getAllReviewUseCase: GetAllReviewUseCase,
        private readonly getUserUseCase: GetUserUseCase,
        private readonly getWalkwayUseCase: GetWalkwayUseCase,
    ) {}

    @Post()
    @HttpCode(StatusCodes.CREATED)
    @ApiCreatedResponse({
        type: CommonResponse,
    })
    async create(
        @Body() request: CreateReviewRequest,
    ): Promise<CommonResponse> {
        // TODO: 차후 UseCase 생성 시 추가
        return {
            code: StatusCodes.CREATED,
            responseMessage: 'SUCCESS TO CREATE REVIEW',
        }
    }

    @Post('/like')
    @HttpCode(StatusCodes.CREATED)
    @ApiCreatedResponse({
        type: CommonResponse,
    })
    async createLike(
        @Body() request: CreateLikeRequest,
    ): Promise<CommonResponse> {
        // TODO: 차후 UseCase 생성 시 추가
        throw new Error('Method not implemented');
    }

    @Get()
    @ApiOperation({
        description: 'walkwayId, userId 중에 최대 하나만 보낼 수 있음. '
        + 'walkwayId만 보낼 경우: 해당하는 walkway의 리뷰 리스트 반환 / '
        + 'userId만 보낼 경우: 해당하는 user의 리뷰 리스트 반환 / '
        + '둘 다 보내지 않을 경우: 전체 리뷰 리스트 반환 (둘 다 보내는 건 구현X)'
    })
    @HttpCode(StatusCodes.OK)
    @ApiOkResponse({
        type: GetAllReviewResponse,
    })
    async getAll(
        @Query('walkwayId') walkwayId?: string,
        @Query('userId') userId?: string,
    ): Promise<GetAllReviewResponse> {
        const [ walkwayResponse, userResponse ] = await Promise.all([
            this.getWalkwayUseCase.execute({
                id: walkwayId,
            }),
            this.getUserUseCase.execute({
                id: userId,
            }),
        ]);

        let getAllReviewUseCaseResponse: IGetAllReviewUseCaseResponse;

        if (walkwayResponse) {
            getAllReviewUseCaseResponse = await this.getAllReviewUseCase.execute({
                walkway: walkwayResponse.walkway,
            });
        }

        if (userResponse) {
            getAllReviewUseCaseResponse = await this.getAllReviewUseCase.execute({
                user: userResponse.user,
            });
        }

        if (!walkwayResponse && !userResponse) {
            getAllReviewUseCaseResponse = await this.getAllReviewUseCase.execute({});
        }

        if (getAllReviewUseCaseResponse.code !== GetAllReviewUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO GET ALL REVIEW', StatusCodes.INTERNAL_SERVER_ERROR)
        }

        const reviews = _.filter(
            _.map(getAllReviewUseCaseResponse.reviews, 
                (review) => ({
                    id: review.id,
                    title: review.title.value,
                    vehicle: review.vehicle,
                    star: review.star.value,
                    content: review.content.value,
                    image: review.image ? review.image.value : null,
                    userId: review.user.id,
                    userName: review.user.name.value,
                    walkwayId: review.walkway.id,
                    walkwayTitle: review.walkway.title.value,
                    createdAt: review.createdAt,
                    updatedAt: review.updatedAt,
                })
            )
        );

        const averageStar = getAllReviewUseCaseResponse.averageStar;

        return {
            reviews,
            averageStar,
        }
    }

    @Get('/like')
    @HttpCode(StatusCodes.OK)
    @ApiOkResponse({
        type: GetAllReviewResponse,
    })
    @ApiOperation({
        description: 'userId에 해당하는 유저가 좋아요 한 리뷰 목록 리턴'
    })
    async getAllLikeReview(
        @Query('userId') userId: string,
    ) {
        // TODO: 차후 Usecase 생성시 추가
        throw new Error('Method not implemented');

    }

    @Patch('/:reviewId')
    @HttpCode(StatusCodes.NO_CONTENT)
    @ApiResponse({
        type: CommonResponse,
    })
    async update(
        @Body() request: UpdateReviewRequest,
        @Param('reviewId') reviewId: string,
    ): Promise<CommonResponse> {
        // TODO: 차후 UseCase 생성 시 추가
        return {
            code: StatusCodes.NO_CONTENT,
            responseMessage: 'SUCCESS TO UPDATE REVIEW',
        }        
    }

    @Delete('/:reviewId')
    @HttpCode(StatusCodes.NO_CONTENT)
    @ApiResponse({
        type: CommonResponse,
    })
    async delete(
        @Param('reviewId') reviewId: string,
    ): Promise<CommonResponse> {
        // TODO: 차후 UseCase 생성 시 추가
        return {
            code: StatusCodes.NO_CONTENT,
            responseMessage: 'SUCCESS TO DELETE REVIEW',
        }
    }

    @Delete('/like')
	@HttpCode(StatusCodes.NO_CONTENT)
	@ApiResponse({
		type: CommonResponse
	})
	async deleteLike(
		@Query('userId') userId: string,
        @Query('reviewId') reviewId: string
	): Promise<CommonResponse> {
		// TODO: 차후 UseCase 생성 시 추가
		throw new Error('Method not implemented');
	}
}
