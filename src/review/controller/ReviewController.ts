import _ from 'lodash';
import { StatusCodes } from 'http-status-codes';
import { Body, Controller, Delete, Get, HttpCode, HttpException, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CommonResponse } from '../../common/controller/dto/CommonResponse';
import { GetUserUseCase, GetUserUseCaseCodes } from '../../user/application/GetUserUseCase/GetUserUseCase';
import { GetAllReviewUseCase, GetAllReviewUseCaseCodes } from '../application/GetAllReviewUseCase/GetAllReviewUseCase';
import { CreateLikeRequest, CreateReviewRequest, UpdateReviewRequest } from './dto/ReviewRequest';
import { FeedDto, GetAllReviewResponse, GetReviewResponse } from './dto/ReviewResponse';
import { GetWalkwayUseCase } from '../../walkway/application/GetWalkwayUseCase/GetWalkwayUseCase';
import { IGetAllReviewUseCaseResponse } from '../application/GetAllReviewUseCase/dto/IGetAllReviewUseCaseResponse';
import { GetReviewUseCase, GetReviewUseCaseCodes } from '../application/GetReviewUseCase/IGetReviewUseCase';
import { GetLikeUseCase, GetLikeUseCaseCodes } from '../application/GetLikeUseCase/IGetLikeUseCase';

@Controller('reviews')
@ApiTags('리뷰')
export class ReviewController {
    constructor(
        private readonly getAllReviewUseCase: GetAllReviewUseCase,
        private readonly getUserUseCase: GetUserUseCase,
        private readonly getWalkwayUseCase: GetWalkwayUseCase,
        private readonly getReviewUseCase: GetReviewUseCase,
        private readonly getLikeUseCase: GetLikeUseCase,
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
                    userId: review.walk.user.id,
                    userName: review.walk.user.name.value,
                    walkwayId: review.walk.walkway.id,
                    walkwayTitle: review.walk.walkway.title.value,
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

    @Get('/:reviewId')
    @ApiOkResponse({
        type: GetReviewResponse,
    })
    @ApiOperation({
        summary: '개별 리뷰 정보 가져오기',
        description: '피드>산책로게시물 페이지에 보여질 리뷰 정보 get / userId는 좋아요 여부를 알기 위함. / ' 
        + 'userId가 주어지지 않으면 like는 false로 리턴'
    })
    async getReview(
        @Param('reviewId') reviewId: string,
        @Query('userId') userId: string,
    ): Promise<GetReviewResponse> {
        const getReviewUseCaseResponse = await this.getReviewUseCase.execute({
            id: reviewId,
        });
        if (getReviewUseCaseResponse.code !== GetReviewUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO FIND REVIEW', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        let like = false;
        if (userId) {
            const getUserUseCaseResponse = await this.getUserUseCase.execute({
                id: userId,
            });

            if (getUserUseCaseResponse.code !== GetUserUseCaseCodes.SUCCESS) {
                throw new HttpException('FAIL TO FIND USER',StatusCodes.INTERNAL_SERVER_ERROR);
            }

            const getLikeUseCaseResponse = await this.getLikeUseCase.execute({
                user: getUserUseCaseResponse.user,
                review: getReviewUseCaseResponse.review,
            })

            if (getLikeUseCaseResponse.like)
                like = true;
        }

        const review: FeedDto = {
            review: {
                id: getReviewUseCaseResponse.review.id,
                title: getReviewUseCaseResponse.review.title.value,
                vehicle: getReviewUseCaseResponse.review.vehicle,
                star: getReviewUseCaseResponse.review.star.value,
                content: getReviewUseCaseResponse.review.content.value,
                userImage: getReviewUseCaseResponse.review.walk.user.image.value,
                userId: getReviewUseCaseResponse.review.walk.user.id,
                userName: getReviewUseCaseResponse.review.walk.user.name.value,
                walkwayId: getReviewUseCaseResponse.review.walk.walkway.id,
                walkwayTitle: getReviewUseCaseResponse.review.walk.walkway.title.value,
                createdAt: getReviewUseCaseResponse.review.createdAt,
                updatedAt: getReviewUseCaseResponse.review.updatedAt,
            },
            time: getReviewUseCaseResponse.review.walk.time.value,
            distance: getReviewUseCaseResponse.review.walk.distance.value,
            // walkwayImage: getReviewUseCaseResponse.review.walk.walkway.image.value,
            address: getReviewUseCaseResponse.review.walk.walkway.address.value,
            // images: getReviewUseCaseResponse.review.images.value,
            like,
        };
        return {
            review,
        };
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
