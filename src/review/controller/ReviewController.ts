import _ from 'lodash';
import { Body, Controller, Delete, Get, HttpCode, HttpException, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';

import { CommonResponse } from '../../common/controller/dto/CommonResponse';
import { GetUserUseCase } from '../../user/application/GetUserUseCase/GetUserUseCase';
import { GetAllReviewUseCase, GetAllReviewUseCaseCodes } from '../application/GetAllReviewUseCase/GetAllReviewUseCase';
import { CreateReviewRequest, UpdateReviewRequest } from './dto/ReviewRequest';
import { GetAllReviewResponse } from './dto/ReviewResponse';

@Controller('review')
@ApiTags('리뷰')
export class ReviewController {
    constructor(
        private readonly getAllReviewUseCase: GetAllReviewUseCase,
        private readonly getUserUseCase: GetUserUseCase,
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

    @Get()
    @HttpCode(StatusCodes.OK)
    @ApiOkResponse({
        type: GetAllReviewResponse,
    })
    async getAll(
        @Query('walkwayId') walkwayId?: string,
        @Query('userId') userId?: string,
    ): Promise<GetAllReviewResponse> {
        const [ walkwayResponse, userResponse ] = await Promise.all([
            // TODO: find walkyway usecase, find user usecase 만든 다음 여기에 추가
            this.getUserUseCase.execute({
                id: walkwayId,
            }),
            // NOTE: 위에 건 진짜 아님
            this.getUserUseCase.execute({
                id: userId,
            }),
        ]);

        const getAllReviewUseCaseResponse = await this.getAllReviewUseCase.execute({
            // walkway: walkwayResponse.walkway,
            user: userResponse.user,
        });

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
                    image: review.image.value,
                    userId: review.user.id,
                    userName: review.user.name.value,
                    walkwayId: review.walkway.id,
                    walkwayTitle: review.walkway.title.value,
                    averageStar: review,
                })
            )
        );

        const averageStar = getAllReviewUseCaseResponse.averageStar;

        return {
            reviews,
            averageStar,
        }
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
}
