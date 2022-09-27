import _ from 'lodash';
import { StatusCodes } from 'http-status-codes';
import { Body, Controller, Delete, Get, HttpCode, HttpException, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CommonResponse } from '../../common/controller/dto/CommonResponse';
import { GetUserUseCase, GetUserUseCaseCodes } from '../../user/application/GetUserUseCase/GetUserUseCase';
import { GetAllReviewUseCase, GetAllReviewUseCaseCodes } from '../application/GetAllReviewUseCase/GetAllReviewUseCase';
import { CreateLikeRequest, CreateReviewRequest, UpdateReviewRequest } from './dto/ReviewRequest';
import { FeedDto, GetAllReviewResponse, GetReviewResponse, GetAllFeedReseponse } from './dto/ReviewResponse';
import { GetWalkwayUseCase } from '../../walkway/application/GetWalkwayUseCase/GetWalkwayUseCase';
import { IGetAllReviewUseCaseResponse } from '../application/GetAllReviewUseCase/dto/IGetAllReviewUseCaseResponse';
import { GetReviewUseCase, GetReviewUseCaseCodes } from '../application/GetReviewUseCase/IGetReviewUseCase';
import { GetLikeUseCase, GetLikeUseCaseCodes } from '../application/GetLikeUseCase/IGetLikeUseCase';
import { GetAllLikeUseCase } from '../application/GetAllLikeUseCase/IGetAllLikeUseCase';
import { CreateLikeUseCase, CreateLikeUseCaseCodes } from '../application/CreateLikeUseCase/CreateLikeUseCase';
import { GetAllReviewImageUseCase, GetAllReviewImageUseCaseCodes } from '../application/GetAllReviewImageUseCase/GetAllReviewImageUseCase';

const is_like_exist = (review, userId, getUserUseCase, getLikeUseCase) => {
    let like = false;
    if (userId) {
        const getUserUseCaseResponse = getUserUseCase.execute({
            id: userId,
        });

        if (!getUserUseCaseResponse || getUserUseCaseResponse.code !== GetUserUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO FIND USER',StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const getLikeUseCaseResponse = getLikeUseCase.execute({
            user: getUserUseCaseResponse.user,
            review,
        });

        if (getLikeUseCaseResponse.like)
            like = true;
    }
    return like;
}

@Controller('reviews')
@ApiTags('리뷰')
export class ReviewController {
    constructor(
        private readonly getAllReviewUseCase: GetAllReviewUseCase,
        private readonly getUserUseCase: GetUserUseCase,
        private readonly getWalkwayUseCase: GetWalkwayUseCase,
        private readonly getReviewUseCase: GetReviewUseCase,
        private readonly getLikeUseCase: GetLikeUseCase,
        private readonly getAllLikeUseCase: GetAllLikeUseCase,
        private readonly createLikeUseCase: CreateLikeUseCase,
        private readonly getAllReviewImageUseCase: GetAllReviewImageUseCase,
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

    @Post('/likes')
    @HttpCode(StatusCodes.CREATED)
    @ApiCreatedResponse({
        type: CommonResponse,
    })
    @ApiOperation({
        summary: '좋아요 생성',
    })
    async createLike(
        @Body() request: CreateLikeRequest,
    ): Promise<CommonResponse> {
        const [ reviewResponse, userResponse ] = await Promise.all([
            this.getReviewUseCase.execute({
                id: request.reviewId,
            }),
            this.getUserUseCase.execute({
                id: request.userId,
            }),
        ]);

        if (reviewResponse.code !== GetReviewUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO CREATE LIKE BY REVIEW', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        if (userResponse.code !== GetUserUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO CREATE LIKE BY USER', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const createLikeUseCaseResponse = await this.createLikeUseCase.execute({
            review: reviewResponse.review,
            user: userResponse.user,
        });

        if (createLikeUseCaseResponse.code !== CreateLikeUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO CREATE LIKE', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        return {
            code: StatusCodes.CREATED,
            responseMessage: 'SUCCESS TO CREATE LIKE',
        };
    }

    @Get()
    @ApiOperation({
        summary: '리뷰 목록 조회 (산책로 세부정보>리뷰)',
        description: 'walkwayId를 보낼 경우: 해당하는 walkway의 리뷰 리스트 반환 / '
        + '보내지 않을 경우: 전체 리뷰 리스트 반환'
    })
    @HttpCode(StatusCodes.OK)
    @ApiOkResponse({
        type: GetAllReviewResponse,
    })
    async getAll(
        @Query('walkwayId') walkwayId?: string,
    ): Promise<GetAllReviewResponse> {
        const walkwayResponse = await this.getWalkwayUseCase.execute({
                id: walkwayId,
        });

        let getAllReviewUseCaseResponse: IGetAllReviewUseCaseResponse;

        if (walkwayId && walkwayResponse) {
            if (!walkwayResponse.walkway) {
                return {
                    reviews: [],
                    averageStar: 0,
                }
            }
            getAllReviewUseCaseResponse = await this.getAllReviewUseCase.execute({
                walkway: walkwayResponse.walkway,
            });
        }

        if (!walkwayId) {
            getAllReviewUseCaseResponse = await this.getAllReviewUseCase.execute({});
        }

        if (getAllReviewUseCaseResponse.code !== GetAllReviewUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO GET ALL REVIEW', StatusCodes.INTERNAL_SERVER_ERROR)
        }

        const reviews = _.map(getAllReviewUseCaseResponse.reviews, 
            (review) => ({
                id: review.id,
                title: review.title.value,
                vehicle: review.vehicle,
                star: review.star.value,
                content: review.content.value,
                userImage: review.walk.user.image ? review.walk.user.image.value : null,
                userId: review.walk.user.id,
                userName: review.walk.user.name.value,
                walkwayId: review.walk.walkway.id,
                walkwayTitle: review.walk.walkway.title.value,
                createdAt: review.createdAt,
                updatedAt: review.updatedAt,
            })
        );

        const averageStar = getAllReviewUseCaseResponse.averageStar;

        return {
            reviews,
            averageStar,
        }
    }

    @Get('/like-reviews')
    @HttpCode(StatusCodes.OK)
    @ApiOkResponse({
        type: GetAllFeedReseponse,
    })
    @ApiOperation({
        summary: '유저가 좋아요한 피드 목록 조회',
        description: 'userId에 해당하는 유저가 좋아요 한 피드 목록 리턴'
    })
    async getAllLikeReview(
        @Query('userId') userId: string,
    ): Promise<GetAllFeedReseponse> {
        const getUserUseCaseResponse = await this.getUserUseCase.execute({
            id: userId,
        });

        if (!getUserUseCaseResponse || getUserUseCaseResponse.code !== GetUserUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO FIND USER',StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const getAllLikeUseCaseResponse = await this.getAllLikeUseCase.execute({
            user: getUserUseCaseResponse.user,
        })

        if (getAllLikeUseCaseResponse.code !== GetLikeUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO FIND ALL LIKES',StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const reviews = _.map(getAllLikeUseCaseResponse.likes, 
            (like) => ({
                review: {
                    id: like.review.id,
                    title: like.review.title.value,
                    vehicle: like.review.vehicle,
                    star: like.review.star.value,
                    content: like.review.content.value,
                    userImage: like.review.walk.user.image.value,
                    userId: like.review.walk.user.id,
                    userName: like.review.walk.user.name.value,
                    walkwayId: like.review.walk.walkway.id,
                    walkwayTitle: like.review.walk.walkway.title.value,
                    createdAt: like.review.createdAt,
                    updatedAt: like.review.updatedAt,
                },
                time: like.review.walk.time.value,
                distance: like.review.walk.distance.value,
                // walkwayImage: like.review.walk.walkway.image.value,
                address: like.review.walk.walkway.address.value,
                // images: like.review.images.value,
                like:true,
            })
        );
        return {
            reviews,
        }
    }

    @Get('/feeds')
    @ApiOkResponse({
        type: GetAllFeedReseponse,
    })
    @HttpCode(StatusCodes.OK)
    @ApiOperation({
        summary: '피드 목록 조회',
        description: 'Feed 목록 (feed 페이지에서의 리뷰 정보 목록)를 반환 / '
        + 'userId를 보낼 경우: 해당하는 user의 리뷰 리스트 반환 (마이페이지>작성한 산책로) / '
        + '보내지 않을 경우: 전체 피드 리스트 반환 (피드 페이지)'
    })
    async getAllFeed(
        @Query('userId') userId?: string,
    ): Promise<GetAllFeedReseponse> {
        const userResponse = await this.getUserUseCase.execute({
                id: userId,
            });

        let getAllReviewUseCaseResponse: IGetAllReviewUseCaseResponse;

        if (userResponse) {
            getAllReviewUseCaseResponse = await this.getAllReviewUseCase.execute({
                user: userResponse.user,
            });
        }
        else {
            getAllReviewUseCaseResponse = await this.getAllReviewUseCase.execute({});
        }

        if (getAllReviewUseCaseResponse.code !== GetAllReviewUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO GET ALL FEED', StatusCodes.INTERNAL_SERVER_ERROR)
        }

        const reviewIds = _.map(getAllReviewUseCaseResponse.reviews, (review) => review.id);
        const getAllReviewImageUseCaseReponse = await this.getAllReviewImageUseCase.execute({
            reviewIds,
        });

        if (getAllReviewImageUseCaseReponse.code !== GetAllReviewImageUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO ET ALL FEED IMAGES', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const reviews: FeedDto[] = _.map(getAllReviewUseCaseResponse.reviews, (review) => {
            const images = _.filter(getAllReviewImageUseCaseReponse.images, (image) => image.review.id === review.id);

            return ({
                review: {
                    id: review.id,
                    title: review.title.value,
                    vehicle: review.vehicle,
                    star: review.star.value,
                    content: review.content.value,
                    userImage: review.walk.user.image.value,
                    userId: review.walk.user.id,
                    userName: review.walk.user.name.value,
                    walkwayId: review.walk.walkway.id,
                    walkwayTitle: review.walk.walkway.title.value,
                    createdAt: review.createdAt,
                    updatedAt: review.updatedAt,
                },
                time: review.walk.time.value,
                distance: review.walk.distance.value,
                // walkwayImage: review.walk.walkway.image.value,
                address: review.walk.walkway.address.value,
                images: _.map(images, (image) => ({
                    id: image.id,
                    url: image.url.value,
                })),
                like: is_like_exist(review, userId, this.getUserUseCase, this.getLikeUseCase),
            });
        });

        return {
            reviews,
        }
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
        if (getReviewUseCaseResponse.code === GetReviewUseCaseCodes.NO_EXIST_REVIEW)
            throw new HttpException('NO EXIST REVIEW', StatusCodes.NOT_FOUND);

        if (getReviewUseCaseResponse.code !== GetReviewUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO FIND REVIEW', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const review: FeedDto = {
            review: {
                id: getReviewUseCaseResponse.review.id,
                title: getReviewUseCaseResponse.review.title.value,
                vehicle: getReviewUseCaseResponse.review.vehicle,
                star: getReviewUseCaseResponse.review.star.value,
                content: getReviewUseCaseResponse.review.content.value,
                userImage: getReviewUseCaseResponse.review.walk.user.image.value,
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
            like: await is_like_exist(getReviewUseCaseResponse.review, userId, this.getUserUseCase, this.getLikeUseCase),
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

    @Delete('/likes')
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
