import { Body, Controller, Delete, Get, HttpCode, HttpException, Patch, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';

import { CommonResponse } from '../../common/controller/dto/CommonResponse';
import { CreateUserUseCase, CreateUserUseCaseCodes } from '../application/CreateUserUseCase/CreateUserUseCase';
import { GetUserUseCase, GetUserUseCaseCodes } from '../application/GetUserUseCase/GetUserUseCase';
import { LoginUseCase, LoginUseCaseCodes } from '../application/LoginUseCase/LoginUseCase';
import { CreateUserRequest, UpdateUserRequest } from './dto/UserRequest';
import { LoginOrSignUpUserResponse, GetAllUserResponse } from './dto/UserResponse';

@Controller('users')
@ApiTags('사용자')
export class UserController {
    constructor(
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly loginUseCase: LoginUseCase,
        private readonly getUserUseCase: GetUserUseCase,
    ) {}

    @Post()
    @HttpCode(StatusCodes.CREATED)
    @ApiCreatedResponse({
        type: LoginOrSignUpUserResponse,
    })
    async create(
        @Body() request: CreateUserRequest,
    ): Promise<LoginOrSignUpUserResponse> {
        const createUserUseCaseResponse = await this.createUserUseCase.execute({
            userId: request.userId,
            password: request.password,
            name: request.name,
            image: request.image,
        });

        if (createUserUseCaseResponse.code === CreateUserUseCaseCodes.DUPLICATE_USER_ID_ERROR) {
            throw new HttpException(CreateUserUseCaseCodes.DUPLICATE_USER_ID_ERROR, StatusCodes.CONFLICT);
        }

        if (createUserUseCaseResponse.code !== CreateUserUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO CREATE USER', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const user = createUserUseCaseResponse.user;

        return {
            id: user.id,    
        };
    }

    @Get()
    @HttpCode(StatusCodes.OK)
    @ApiOkResponse({
        type: GetAllUserResponse,
    })
    async getAll() {
        // TODO: 차후 Usecase 생성시 추가
    }

    @Get('checked-id')
    @HttpCode(StatusCodes.OK)
    @ApiOkResponse({
        type: CommonResponse
    })
    async checkId(
        @Query('userId') userId: string,
    ): Promise<CommonResponse> {
        const getUserUseCaseResponse = await this.getUserUseCase.execute({
            userId,
        });

        if (getUserUseCaseResponse.code === GetUserUseCaseCodes.DUPLICATE_USER_ID_ERROR) {
            return {
                code: StatusCodes.CONFLICT,
                responseMessage: GetUserUseCaseCodes.DUPLICATE_USER_ID_ERROR,
                isValid: false,
            }
        }

        if (getUserUseCaseResponse.code !== GetUserUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO GET USER ID', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        return {
            code: StatusCodes.OK,
            responseMessage: 'Available User ID.',
            isValid: true,
        }
    }

    @Get('/login')
    @HttpCode(StatusCodes.OK)
    @ApiOkResponse({
        type: LoginOrSignUpUserResponse,
    })
    async login(
        @Query('userId') userId: string,
        @Query('password') password: string,
    ): Promise<LoginOrSignUpUserResponse> {
        const loginUsecaseResponse = await this.loginUseCase.execute({
            userId,
            password,
        })

        if (_.isNil(loginUsecaseResponse.user)) {
            return {
                id: null,
            };
        }

        if (loginUsecaseResponse.code === LoginUseCaseCodes.NO_MATCH_USER_ERROR) {
            throw new HttpException(LoginUseCaseCodes.NO_MATCH_USER_ERROR, StatusCodes.NOT_FOUND);
        }

        if (loginUsecaseResponse.code !== LoginUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO LOGIN', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const user = loginUsecaseResponse.user;

        return {
            id: user.id,
        }
    }

    @Patch('/:userId')
    @HttpCode(StatusCodes.NO_CONTENT)
    @ApiResponse({
        type: CommonResponse,
    })
    async update(
        @Body() request: UpdateUserRequest,
    ): Promise<CommonResponse> {
        // TODO: 차후 Usecase 생성시 추가
        return {
            code: StatusCodes.NO_CONTENT,
            responseMessage: 'SUCCESS TO UPDATE USER',
        }        
    }

    @Delete('/:userId')
    @HttpCode(StatusCodes.NO_CONTENT)
    @ApiResponse({
        type: CommonResponse,
    })
    async delete(): Promise<CommonResponse> {
        // TODO: 차후 Usecase 생성시 추가
        return {
            code: StatusCodes.NO_CONTENT,
            responseMessage: 'SUCCESS TO DELETE USER',
        }
    }
}
