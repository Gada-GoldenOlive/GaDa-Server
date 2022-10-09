import _ from 'lodash';
import { StatusCodes } from 'http-status-codes';
import { Body, Controller, Delete, Get, HttpCode, HttpException, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CommonResponse } from '../../common/controller/dto/CommonResponse';
import { GetAllReviewUseCase, GetAllReviewUseCaseCodes } from '../application/GetAllReviewUseCase/GetAllReviewUseCase';
import { CreateLikeRequest, CreateReviewRequest, UpdateReviewRequest } from './dto/ReviewRequest';
import { FeedDto, GetAllReviewResponse, GetFeedResponse, GetAllFeedResponse } from './dto/ReviewResponse';
import { GetWalkwayUseCase } from '../../walkway/application/GetWalkwayUseCase/GetWalkwayUseCase';
import { IGetAllReviewUseCaseResponse } from '../application/GetAllReviewUseCase/dto/IGetAllReviewUseCaseResponse';
import { GetReviewUseCase, GetReviewUseCaseCodes } from '../application/GetReviewUseCase/IGetReviewUseCase';
import { GetLikeUseCase, GetLikeUseCaseCodes } from '../application/GetLikeUseCase/IGetLikeUseCase';
import { GetAllLikeUseCase } from '../application/GetAllLikeUseCase/IGetAllLikeUseCase';
import { CreateLikeUseCase, CreateLikeUseCaseCodes } from '../application/CreateLikeUseCase/CreateLikeUseCase';
import { GetAllReviewImageUseCase, GetAllReviewImageUseCaseCodes } from '../application/GetAllReviewImageUseCase/GetAllReviewImageUseCase';
import { ReviewOwnerGuard } from '../review-owner.guard';
import { LikeOwnerGuard } from '../like-owner.guard';
import { JwtAuthGuard } from '../../auth/jwt-auth.gaurd';
import { CreateReviewUseCase, CreateReviewUseCaseCodes } from '../application/CreateReviewUseCase/CreateReviewUseCase';
import { GetWalkUseCase, GetWalkUseCaseCodes } from '../../walkway/application/GetWalkUseCase/GetWalkUseCase';
import { CreateAllReviewImageUseCase, CreateAllReviewImageUseCaseCodes } from '../application/CreateAllReviewImageUseCase/CreateAllReviewImageUseCase';
import { Review } from '../domain/Review/Review';
import { Image } from '../../common/domain/Image/Image';
import { User } from '../../user/domain/User/User';
import { UserStatus } from '../../user/domain/User/UserStatus';

@Controller('reviews')
@ApiTags('리뷰')
export class ReviewController {
    constructor(
        private readonly getAllReviewUseCase: GetAllReviewUseCase,
        private readonly getWalkwayUseCase: GetWalkwayUseCase,
        private readonly getReviewUseCase: GetReviewUseCase,
        private readonly getLikeUseCase: GetLikeUseCase,
        private readonly getAllLikeUseCase: GetAllLikeUseCase,
        private readonly createLikeUseCase: CreateLikeUseCase,
        private readonly getAllReviewImageUseCase: GetAllReviewImageUseCase,
        private readonly createReviewUseCase: CreateReviewUseCase,
        private readonly getWalkUseCase: GetWalkUseCase,
        private readonly createAllReviewImageUseCase: CreateAllReviewImageUseCase,
    ) {}

    private async is_like_exist(review, user): Promise<boolean> {
        let like = false;
        if (user) {
            const getLikeUseCaseResponse = await this.getLikeUseCase.execute({
                user,
                review,
            });
    
            if (getLikeUseCaseResponse.like)
                like = true;
        }
        return like;
    }

    private async convertToFeedDto(review: Review, images: Image[], user: User): Promise<FeedDto> {
        let userImage = review.walk.user.image ? review.walk.user.image.value : null;
        let userName = review.walk.user.name.value;

        if (review.walk.user.status === UserStatus.DELETE) {
            userImage = null;
            userName = '탈퇴한 회원';
        }

        return ({
            id: review.id,
            title: review.title.value,
            vehicle: review.vehicle,
            star: review.star.value,
            content: review.content.value,
            userImage,
            userName,
            walkwayId: review.walk.walkway.id,
            walkwayTitle: review.walk.walkway.title.value,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
            time: review.walk.time.value,
            distance: review.walk.distance.value,
            walkwayImage: review.walk.walkway.image ? review.walk.walkway.image.value : null,
            address: review.walk.walkway.address.value,
            images: _.map(images, (image) => ({
                id: image.id,
                url: image.url.value,
            })),
            like: await this.is_like_exist(review, user),
        });
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @HttpCode(StatusCodes.CREATED)
    @ApiCreatedResponse({
        type: GetFeedResponse,
    })
    @ApiOperation({
        summary: '리뷰 생성',
    })
    async create(
        @Body() body: CreateReviewRequest,
        @Request() request,
    ): Promise<GetFeedResponse> {
        const getWalkUseCaseResponse = await this.getWalkUseCase.execute({
            id: body.walkId,
        });

        if (getWalkUseCaseResponse.code === GetWalkUseCaseCodes.NOT_EXIST_WALK) {
            throw new HttpException(getWalkUseCaseResponse.code, StatusCodes.NOT_FOUND);
        }
        if (getWalkUseCaseResponse.code !== GetWalkUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO FIND WALK', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const createReviewUseCaseResponse = await this.createReviewUseCase.execute({
            title: body.title,
            vehicle: body.vehicle,
            star: body.star,
            content: body.content,
            walk: getWalkUseCaseResponse.walk,
        });

        if (createReviewUseCaseResponse.code !== CreateReviewUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO CREATE REVIEW', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const review = createReviewUseCaseResponse.review;

        const createAllReviewImageUseCaseResponse = await this.createAllReviewImageUseCase.execute({
            review,
            urls: body.images,
        });

        if (createAllReviewImageUseCaseResponse.code !== CreateAllReviewImageUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO CREATE ALL REVIEWIMAGE', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const getAllReviewImageUseCaseReponse = await this.getAllReviewImageUseCase.execute({
            reviewIds: [review.id],
        });

        if (getAllReviewImageUseCaseReponse.code !== GetAllReviewImageUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO GET ALL FEED IMAGE', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const feed: FeedDto = await this.convertToFeedDto(review, getAllReviewImageUseCaseReponse.images, request.user);

        return {
            feed,
        };
    }

    @Post('/likes')
    @UseGuards(JwtAuthGuard)
    @HttpCode(StatusCodes.CREATED)
    @ApiCreatedResponse({
        type: CommonResponse,
    })
    @ApiOperation({
        summary: '좋아요 생성',
    })
    async createLike(
        @Request() request,
        @Body() body: CreateLikeRequest,
    ): Promise<CommonResponse> {
        const reviewResponse = await this.getReviewUseCase.execute({
            id: body.reviewId,
        });

        if (reviewResponse.code !== GetReviewUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO CREATE LIKE BY REVIEW', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const createLikeUseCaseResponse = await this.createLikeUseCase.execute({
            review: reviewResponse.review,
            user: request.user,
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
    @UseGuards(JwtAuthGuard)
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
                };
            }
            getAllReviewUseCaseResponse = await this.getAllReviewUseCase.execute({
                walkway: walkwayResponse.walkway,
            });
        }

        if (!walkwayId) {
            getAllReviewUseCaseResponse = await this.getAllReviewUseCase.execute({});
        }

        if (getAllReviewUseCaseResponse.code !== GetAllReviewUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO GET ALL REVIEW', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const reviews = _.map(getAllReviewUseCaseResponse.reviews, (review) => {
            let userId = review.walk.user.id;
            let userImage = review.walk.user.image ? review.walk.user.image.value : null;
            let userName = review.walk.user.name.value;

            if (review.walk.user.status === UserStatus.DELETE) {
                userId = 'jonjaehaji-aneum';
                userImage = null;
                userName = '탈퇴한 회원';
            }
            
            return {
                id: review.id,
                title: review.title.value,
                vehicle: review.vehicle,
                star: review.star.value,
                content: review.content.value,
                userImage,
                userId,
                userName,
                walkwayId: review.walk.walkway.id,
                walkwayTitle: review.walk.walkway.title.value,
                createdAt: review.createdAt,
                updatedAt: review.updatedAt,
            };
        });

        const averageStar = getAllReviewUseCaseResponse.averageStar;

        return {
            reviews,
            averageStar,
        };
    }

    @Get('/like-reviews')
    @UseGuards(JwtAuthGuard)
    @HttpCode(StatusCodes.OK)
    @ApiOkResponse({
        type: GetAllFeedResponse,
    })
    @ApiOperation({
        summary: '유저가 좋아요한 피드 목록 조회',
        description: 'token에 해당하는 유저가 좋아요 한 피드 목록 리턴'
    })
    async getAllLikeReview(
        @Request() request,
    ): Promise<GetAllFeedResponse> {
        const getAllLikeUseCaseResponse = await this.getAllLikeUseCase.execute({
            user: request.user,
        });

        if (getAllLikeUseCaseResponse.code !== GetLikeUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO FIND ALL LIKES',StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const reviewIds = _.map(getAllLikeUseCaseResponse.likes, (like) => like.review.id);
        const getAllReviewImageUseCaseReponse = await this.getAllReviewImageUseCase.execute({
            reviewIds,
        });

        if (getAllReviewImageUseCaseReponse.code !== GetAllReviewImageUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO GET ALL FEED IMAGE', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const feeds: FeedDto[] = await Promise.all(_.map(getAllLikeUseCaseResponse.likes, (like) => {
            const images = _.filter(getAllReviewImageUseCaseReponse.images, (image) => image.review.id === like.review.id);

            return this.convertToFeedDto(like.review, images, request.user);
        }));

        return {
            feeds,
        };
    }

    @Get('/feeds')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({
        type: GetAllFeedResponse,
    })
    @HttpCode(StatusCodes.OK)
    @ApiOperation({
        summary: '피드 목록 조회',
        description: 'Feed 목록 (feed 페이지에서의 리뷰 정보 목록)를 반환 / '
        + 'userId를 보낼 경우: 해당하는 user의 리뷰 리스트 반환 (마이페이지>작성한 산책로) / '
        + '보내지 않을 경우: 전체 피드 리스트 반환 (피드 페이지)'
    })
    async getAllFeed(
        @Request() request,
        @Query('userId') userId?: string,
    ): Promise<GetAllFeedResponse> {
        let getAllReviewUseCaseResponse: IGetAllReviewUseCaseResponse;

        if (userId) {
            getAllReviewUseCaseResponse = await this.getAllReviewUseCase.execute({
                user: request.user,
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
            throw new HttpException('FAIL TO GET ALL FEED IMAGE', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const feeds: FeedDto[] = await Promise.all(_.map(getAllReviewUseCaseResponse.reviews, (review) => {
            const images = _.filter(getAllReviewImageUseCaseReponse.images, (image) => image.review.id === review.id);

            return this.convertToFeedDto(review, images, request.user);
        }));

        return {
            feeds,
        };
    }

    @Get('/:reviewId')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({
        type: GetFeedResponse,
    })
    @ApiOperation({
        summary: '개별 리뷰 정보 가져오기',
        description: '피드>산책로게시물 페이지에 보여질 리뷰 정보 get' 
    })
    async getReview(
        @Param('reviewId') reviewId: string,
        @Request() request,
    ): Promise<GetFeedResponse> {
        const getReviewUseCaseResponse = await this.getReviewUseCase.execute({
            id: reviewId,
        });
          
        if (getReviewUseCaseResponse.code === GetReviewUseCaseCodes.NOT_EXIST_REVIEW) {
            throw new HttpException('NO EXIST REVIEW', StatusCodes.NOT_FOUND);
        }

        if (getReviewUseCaseResponse.code !== GetReviewUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO FIND REVIEW', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const review = getReviewUseCaseResponse.review;

        const getAllReviewImageUseCaseReponse = await this.getAllReviewImageUseCase.execute({
            reviewIds: [review.id],
        });

        if (getAllReviewImageUseCaseReponse.code !== GetAllReviewImageUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO GET ALL FEED IMAGE', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const feed: FeedDto = await this.convertToFeedDto(review, getAllReviewImageUseCaseReponse.images, request.user);

        return {
            feed,
        };
    }

    @Patch('/:reviewId')
    @UseGuards(JwtAuthGuard)
    @UseGuards(ReviewOwnerGuard)
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
    @UseGuards(JwtAuthGuard)
    @UseGuards(ReviewOwnerGuard)
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

    @Delete('/likes/:likeId')
    @UseGuards(JwtAuthGuard)
    @UseGuards(LikeOwnerGuard)
    @HttpCode(StatusCodes.NO_CONTENT)
	@ApiResponse({
		type: CommonResponse
	})
	async deleteLike(
		@Param('likeId') likeId: string,
	): Promise<CommonResponse> {
		// TODO: 차후 UseCase 생성 시 추가
		throw new Error('Method not implemented');
	}
}
