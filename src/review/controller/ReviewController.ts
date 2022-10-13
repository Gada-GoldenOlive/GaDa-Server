import _ from 'lodash';
import { StatusCodes } from 'http-status-codes';
import { Body, Controller, Delete, Get, HttpCode, HttpException, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CommonResponse } from '../../common/controller/dto/CommonResponse';
import { GetAllReviewUseCase, GetAllReviewUseCaseCodes } from '../application/GetAllReviewUseCase/GetAllReviewUseCase';
import { CreateLikeRequest, CreateReviewRequest, UpdateReviewRequest } from './dto/ReviewRequest';
import { FeedDto, GetAllReviewResponse, GetFeedResponse, GetAllFeedResponse, CreatePreSignedUrlResponse, ImageDto, ReviewDto } from './dto/ReviewResponse';
import { GetWalkwayUseCase } from '../../walkway/application/GetWalkwayUseCase/GetWalkwayUseCase';
import { IGetAllReviewUseCaseResponse } from '../application/GetAllReviewUseCase/dto/IGetAllReviewUseCaseResponse';
import { GetReviewUseCase, GetReviewUseCaseCodes } from '../application/GetReviewUseCase/IGetReviewUseCase';
import { GetLikeUseCase, GetLikeUseCaseCodes } from '../application/GetLikeUseCase/IGetLikeUseCase';
import { GetAllLikeUseCase, GetAllLikeUseCaseCodes } from '../application/GetAllLikeUseCase/IGetAllLikeUseCase';
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
import { DeleteReviewUseCase, DeleteReviewUseCaseCodes } from '../application/DeleteReviewUseCase/DeleteReviewUseCase';
import { Achieve } from '../../badge/domain/Achieve/Achieve';
import { BadgeCategory, BADGE_CATEGORY } from '../../badge/domain/Badge/BadgeCategory';
import { BadgeCode, BADGE_CODE } from '../../badge/domain/Badge/BadgeCode';
import { GetAchieveUseCase, GetAchieveUseCaseCodes } from '../../badge/application/GetAchieveUseCase/GetAchieveUseCase';
import { UpdateAchieveUseCase, UpdateAchieveUseCaseCodes } from '../../badge/application/UpdateAchieveUseCase/UpdateAchieveUseCase';
import { AchieveStatus } from '../../badge/domain/Achieve/AchieveStatus';
import { DeleteLikeUseCase, DeleteLikeUseCaseCodes } from '../application/DeleteLikeUseCase/DeleteLikeUseCase';
import { UpdateLikeUseCase, UpdateLikeUseCaseCodes } from '../application/UpdateLikeUseCase/UpdateLikeUseCase';
import { LikeStatus } from '../domain/Like/LikeStatus';
import { UpdateReviewUseCase, UpdateReviewUseCaseCodes } from '../application/UpdateReviewUseCase/UpdateReviewUseCase';
import { DeleteAllReviewImageUseCase, DeleteAllReviewImageUseCaseCodes } from '../application/DeleteAllReviewImageUseCase/DeleteAllReviewImageUseCase';
import { ReviewOrderOptions, REVIEW_ORDER_OPTIONS } from '../infra/mysql/MysqlReviewRepository';

@Controller('reviews')
@ApiTags('리뷰')
export class ReviewController {
    constructor(
        private readonly getAllReviewUseCase: GetAllReviewUseCase,
        private readonly getWalkwayUseCase: GetWalkwayUseCase,
        private readonly getReviewUseCase: GetReviewUseCase,
        private readonly deleteReviewUseCase: DeleteReviewUseCase,
        private readonly getLikeUseCase: GetLikeUseCase,
        private readonly getAllLikeUseCase: GetAllLikeUseCase,
        private readonly createLikeUseCase: CreateLikeUseCase,
        private readonly deleteLikeUseCase: DeleteLikeUseCase,
        private readonly updateLikeUseCase: UpdateLikeUseCase,
        private readonly getAllReviewImageUseCase: GetAllReviewImageUseCase,
        private readonly createReviewUseCase: CreateReviewUseCase,
        private readonly getWalkUseCase: GetWalkUseCase,
        private readonly createAllReviewImageUseCase: CreateAllReviewImageUseCase,
        private readonly getAchieveUseCase: GetAchieveUseCase,
        private readonly updateAchieveUseCase: UpdateAchieveUseCase,
        private readonly updateReviewUseCase: UpdateReviewUseCase,
        private readonly deleteAllReviewImageUseCase: DeleteAllReviewImageUseCase,
    ) {}

    private achieves: Achieve[] = [];

    private async pushAchieve(user: User, category: BadgeCategory, code: BadgeCode, achieves: Achieve[]): Promise<boolean> {
        const getAchieveUseCaseResponse = await this.getAchieveUseCase.execute({
            user,
            category: category as BADGE_CATEGORY,
            code: code as BADGE_CODE,
        });

        // NOTE: not_exist_achieve는 있을 수 있으니까 failure일때만으로 설정함
        if (getAchieveUseCaseResponse.code === GetAchieveUseCaseCodes.FAILURE) {
            throw new HttpException('FAIL TO GET ACHIEVE', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const achieve = getAchieveUseCaseResponse.achieve;

        if (getAchieveUseCaseResponse.code !== GetAchieveUseCaseCodes.NOT_EXIST_ACHIEVE) {
            achieves.unshift(achieve);
        }

        return true;
    }

    private async is_like_exist(review: Review, user: User): Promise<boolean> {
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
        let userId = review.walk.user.id;

        if (review.walk.user.status === UserStatus.DELETE) {
            userImage = null;
            userName = '탈퇴한 회원';
            userId = 'jonjaehaji-aneum';
        }

        return ({
            id: review.id,
            title: review.title.value,
            vehicle: review.vehicle,
            star: review.star.value,
            content: review.content.value,
            userId,
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
        this.achieves = [];
        
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

        const getAllReviewUseCaseResponse = await this.getAllReviewUseCase.execute({
            user: request.user,
        });

        const reviews = getAllReviewUseCaseResponse.reviews;

        if (reviews.length >= 100) {
            await this.pushAchieve(request.user, BadgeCategory.REVIEW, BadgeCode.HUNDRED, this.achieves);
        }
        if (reviews.length >= 20) {
            await this.pushAchieve(request.user, BadgeCategory.REVIEW, BadgeCode.TWENTY, this.achieves);
        }
        if (reviews.length >= 10) {
            await this.pushAchieve(request.user, BadgeCategory.REVIEW, BadgeCode.TEN, this.achieves);
        }
        if (reviews.length >= 5) {
            await this.pushAchieve(request.user, BadgeCategory.REVIEW, BadgeCode.FIVE, this.achieves);
        }
        if (reviews.length >= 3) {
            await this.pushAchieve(request.user, BadgeCategory.REVIEW, BadgeCode.THREE, this.achieves);
        }

        if (this.achieves.length !== 0) {
            _.map(this.achieves, async (achieve) => {
                const updateAchieveUseCaseResponse = await this.updateAchieveUseCase.execute({
                    id: achieve.id,
                    status: AchieveStatus.ACHIEVE,
                });

                if (updateAchieveUseCaseResponse.code !== UpdateAchieveUseCaseCodes.SUCCESS) {
                    throw new HttpException('FAIL TO UPDATE ACHIEVE', StatusCodes.INTERNAL_SERVER_ERROR);
                }
            });

            return {
                code: StatusCodes.CREATED,
                responseMessage: 'SUCCESS TO CREATE WALK AND GET BADGE',
                feed,
                achieves: _.map(this.achieves, (achieve) => {
                    return {
                        badge: {
                            title: achieve.badge.title.value,
                            image: achieve.badge.image.value,
                        },
                        status: achieve.status,
                    };
                }),
            };
        }

        return {
            code: StatusCodes.CREATED,
            responseMessage: 'SUCCESS TO CREATE REVEIW',
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

        const getLikeUseCaseResponse = await this.getLikeUseCase.execute({
            user: request.user,
            review: reviewResponse.review,
            is_include_delete: true,
        });

        if (getLikeUseCaseResponse.code !== GetLikeUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO GET LIKE', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        if (getLikeUseCaseResponse.like) {
            const updateLikeUseCaseResponse = await this.updateLikeUseCase.execute({
                like: getLikeUseCaseResponse.like,
                status: LikeStatus.NORMAL,
            });

            if (updateLikeUseCaseResponse.code !== UpdateLikeUseCaseCodes.SUCCESS) {
                throw new HttpException('FAIL TO UPDATE LIKE', StatusCodes.INTERNAL_SERVER_ERROR);
            }
        }
        else {
            const createLikeUseCaseResponse = await this.createLikeUseCase.execute({
                review: reviewResponse.review,
                user: request.user,
            });
    
            if (createLikeUseCaseResponse.code !== CreateLikeUseCaseCodes.SUCCESS) {
                throw new HttpException('FAIL TO CREATE LIKE', StatusCodes.INTERNAL_SERVER_ERROR);
            }
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

        const reviews = _.map(getAllReviewUseCaseResponse.reviews, function(review): ReviewDto {
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
        summary: '전체 피드 목록 조회 (피드 페이지)',
        description: 'order: "DISTANCE" (거리순), "LATEST" (최신순), "LIKE" (좋아요순)<br>'
        + '&nbsp; - "DISTANCE의 경우 현 위치를 lat, lng으로 넘겨줘야 함.<br>'
        + '&nbsp; - 디폴트는 최신순'
    })
    async getAllFeed(
        @Request() request,
        @Query('order') order?: REVIEW_ORDER_OPTIONS,
        @Query('lat') lat?: number,
        @Query('lng') lng?: number,
    ): Promise<GetAllFeedResponse> {
        const getAllReviewUseCaseResponse = await this.getAllReviewUseCase.execute({
            reviewOrderOption: order,
            lat,
            lng,
        });

        if (getAllReviewUseCaseResponse.code === GetAllReviewUseCaseCodes.NO_CURRENT_LOCATION) {
            throw new HttpException(GetAllReviewUseCaseCodes.NO_CURRENT_LOCATION, StatusCodes.BAD_REQUEST);
        }

        if (getAllReviewUseCaseResponse.code !== GetAllReviewUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO GET ALL FEED', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        let reviews = getAllReviewUseCaseResponse.reviews;

        if (order === ReviewOrderOptions.LIKE) {
            const reviewsWithLikeCount = (await Promise.all(_.map(reviews, async (review) => {
                const getAllLikeUseCaseResponse = await this.getAllLikeUseCase.execute({
                    review,
                });

                if (getAllLikeUseCaseResponse.code !== GetAllLikeUseCaseCodes.SUCCESS) {
                    throw new HttpException('FAIL TO FIND ALL LIKES',StatusCodes.INTERNAL_SERVER_ERROR);
                }

                return {
                    review,
                    likeCount: getAllLikeUseCaseResponse.likes.length,
                };
            }))).sort((a, b) => {
                return b.likeCount - a.likeCount;
            });

            reviews = _.map(reviewsWithLikeCount, (review) => {
                return review.review;
            });
        }

        const reviewIds = _.map(reviews, (review) => review.id);

        const getAllReviewImageUseCaseReponse = await this.getAllReviewImageUseCase.execute({
            reviewIds,
        });

        if (getAllReviewImageUseCaseReponse.code !== GetAllReviewImageUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO GET ALL FEED IMAGE', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const feeds: FeedDto[] = await Promise.all(_.map(reviews, (review) => {
            const images = _.filter(getAllReviewImageUseCaseReponse.images, (image) => image.review.id === review.id);

            return this.convertToFeedDto(review, images, request.user);
        }));

        return {
            feeds,
        };
    }

    @Get('/feeds/:userId')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({
        type: GetAllFeedResponse,
    })
    @HttpCode(StatusCodes.OK)
    @ApiOperation({
        summary: 'userId에 해당하는 유저가 작성한 피드 목록 조회 (마이페이지>작성한 산책로)',
    })
    async getAllFeedByUser(
        @Request() request,
        @Param('userId') userId?: string,
    ): Promise<GetAllFeedResponse> {
        const getAllReviewUseCaseResponse = await this.getAllReviewUseCase.execute({
            user: request.user,
        });

        if (getAllReviewUseCaseResponse.code !== GetAllReviewUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO GET ALL FEED', StatusCodes.INTERNAL_SERVER_ERROR);
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
        summary: '개별 리뷰 정보(피드 게시글) 가져오기',
        description: '피드에 보여질 피드 게시글 정보 get',
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
            code: StatusCodes.OK,
            responseMessage: 'SUCCESS TO GET FEED',
            feed,
        };
    }

    @Patch('/:reviewId')
    @UseGuards(ReviewOwnerGuard)
    @UseGuards(JwtAuthGuard)
    @HttpCode(StatusCodes.OK)
    @ApiResponse({
        type: GetFeedResponse,
    })
    @ApiOperation({
        summary: '리뷰 수정',
        description: '새로운 이미지를 추가하고 싶다면 images에 기존 이미지들 + "url"만 있는 이미지를 넣으면 됨.' 
    })
    @ApiOperation({
        summary: '리뷰 삭제',
    })
    async update(
        @Body() body: UpdateReviewRequest,
        @Param('reviewId') reviewId: string,
        @Request() request,
    ): Promise<GetFeedResponse> {
        const updateReviewUseCaseResposne = await this.updateReviewUseCase.execute({
            id: reviewId,
            title: body.title,
            vehicle: body.vehicle,
            star: body.star,
            content: body.content,
        });

        if (updateReviewUseCaseResposne.code === UpdateReviewUseCaseCodes.NOT_EXIST_REVIEW) {
            throw new HttpException(UpdateReviewUseCaseCodes.NOT_EXIST_REVIEW, StatusCodes.NOT_FOUND);
        }

        if (updateReviewUseCaseResposne.code !== UpdateReviewUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO UPDATE REVIEW', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const review = updateReviewUseCaseResposne.review;

        let getAllReviewImageUseCaseResponse = await this.getAllReviewImageUseCase.execute({
            reviewIds: [review.id],
        });

        if (getAllReviewImageUseCaseResponse.code !== GetAllReviewImageUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO GET ALL FEED IMAGE', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        // NOTE: body.images가 null이 아니라면 review image 수정
        if (body.images) {
            const requestImageIds = _.map(body.images, (image) => image.id);

            const imagesToDelete =  getAllReviewImageUseCaseResponse.images.filter((image) => {
                return !requestImageIds.includes(image.id);
            });

            const imageIds = _.map(getAllReviewImageUseCaseResponse.images, (image) => image.id);

            const imagesToAdd = body.images.filter((image) => {
                return !imageIds.includes(image.id);
            });

            const deleteAllReviewImageUseCaseResponse = await this.deleteAllReviewImageUseCase.execute({
                ids: _.map(imagesToDelete, (image) => image.id),
            });

            if (deleteAllReviewImageUseCaseResponse.code !== DeleteAllReviewImageUseCaseCodes.SUCCESS) {
                throw new HttpException('FAIL TO DELETE REVIEW IMAGES', StatusCodes.INTERNAL_SERVER_ERROR);
            }

            const createAllReviewImageUseCaseResponse = await this.createAllReviewImageUseCase.execute({
                review,
                urls: _.map(imagesToAdd, (image) => image.url),
            });

            if (createAllReviewImageUseCaseResponse.code !== CreateAllReviewImageUseCaseCodes.SUCCESS) {
                throw new HttpException('FAIL TO CREATE REVIEW IMAGES', StatusCodes.INTERNAL_SERVER_ERROR);
            }

            getAllReviewImageUseCaseResponse = await this.getAllReviewImageUseCase.execute({
                reviewIds: [review.id],
            });

            if (getAllReviewImageUseCaseResponse.code !== GetAllReviewImageUseCaseCodes.SUCCESS) {
                throw new HttpException('FAIL TO GET ALL FEED IMAGE', StatusCodes.INTERNAL_SERVER_ERROR);
            }
        }

        const feed: FeedDto = await this.convertToFeedDto(review, getAllReviewImageUseCaseResponse.images, request.user);

        return {
            code: StatusCodes.OK,
            responseMessage: 'SUCCESS TO UPDATE REVIEW',
            feed,
        };
    }

    @Delete('/:reviewId')
    @UseGuards(ReviewOwnerGuard)
    @UseGuards(JwtAuthGuard)
    @HttpCode(StatusCodes.NO_CONTENT)
    @ApiResponse({
        type: CommonResponse,
    })
    async delete(
        @Param('reviewId') reviewId: string,
    ): Promise<CommonResponse> {
        const getAllReviewImageUseCaseResponse = await this.getAllReviewImageUseCase.execute({
            reviewIds: [reviewId],
        });

        if (getAllReviewImageUseCaseResponse.code !== GetAllReviewImageUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO GET ALL FEED IMAGE', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const deleteAllReviewImageUseCaseResponse = await this.deleteAllReviewImageUseCase.execute({
            ids: _.map(getAllReviewImageUseCaseResponse.images, (image) => image.id),
        });

        if (deleteAllReviewImageUseCaseResponse.code !== DeleteAllReviewImageUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO DELETE REVIEW IMAGES', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const deleteReviewUseCaseResponse = await this.deleteReviewUseCase.execute({
            id: reviewId,
        });

        if (deleteReviewUseCaseResponse.code === DeleteReviewUseCaseCodes.NOT_EXIST_REVIEW) {
            throw new HttpException(DeleteReviewUseCaseCodes.NOT_EXIST_REVIEW, StatusCodes.NOT_FOUND);
        }

        if (deleteReviewUseCaseResponse.code !== DeleteReviewUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO DELETE REVIEW', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        return {
            code: StatusCodes.NO_CONTENT,
            responseMessage: 'SUCCESS TO DELETE REVIEW',
        }
    }

    @Delete('/likes/:reviewId')
    @UseGuards(LikeOwnerGuard)
    @UseGuards(JwtAuthGuard)
    @HttpCode(StatusCodes.NO_CONTENT)
    @ApiResponse({
        type: CommonResponse
    })
    @ApiOperation({
        summary: '좋아요 취소',
        description: '토큰에 해당하는 유저가 reviewId에 해당하는 리뷰에 좋아요한 내역을 삭제함.'
    })
    async deleteLike(
        @Param('reviewId') reviewId: string,
        @Request() request,
    ): Promise<CommonResponse> {
        const getReviewUseCaseResponse = await this.getReviewUseCase.execute({
            id: reviewId,
        });
          
        if (getReviewUseCaseResponse.code === GetReviewUseCaseCodes.NOT_EXIST_REVIEW) {
            throw new HttpException('NO EXIST REVIEW', StatusCodes.NOT_FOUND);
        }

        if (getReviewUseCaseResponse.code !== GetReviewUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO FIND REVIEW', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const deleteLikeUseCaseResponse = await this.deleteLikeUseCase.execute({
            review: getReviewUseCaseResponse.review,
            user: request.user,
        });

        if (deleteLikeUseCaseResponse.code === DeleteLikeUseCaseCodes.NOT_EXIST_LIKE) {
            throw new HttpException(DeleteLikeUseCaseCodes.NOT_EXIST_LIKE, StatusCodes.NOT_FOUND);
        }

        if (deleteLikeUseCaseResponse.code !== DeleteLikeUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO DELETE LIKE', StatusCodes.NOT_FOUND);
        }

        return {
            code: StatusCodes.NO_CONTENT,
            responseMessage: 'SUCCESS TO DELETE LIKE',
        };
    }
}
