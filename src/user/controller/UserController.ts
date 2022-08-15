import { Body, Controller, Delete, Get, HttpCode, HttpException, Patch, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';

import { CommonResponse } from '../../common/controller/dto/CommonResponse';
import { CreateUserUseCase, CreateUserUseCaseCodes } from '../application/CreateUserUseCase/CreateUserUseCase';
import { LoginUseCase, LoginUseCaseCodes } from '../application/LoginUseCase/LoginUseCase';
import { CreateUserRequest, UpdateUserRequest } from './dto/UserRequest';
import { LoginUserResponse, GetAllUserResponse } from './dto/UserResponse';

@Controller('users')
@ApiTags('사용자')
export class UserController {
    constructor(
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly loginUseCase: LoginUseCase,
    ) {}

    @Post()
    @HttpCode(StatusCodes.CREATED)
    @ApiCreatedResponse({
        type: LoginUserResponse,
    })
    async create(
        @Body() request: CreateUserRequest,
    ): Promise<LoginUserResponse> {
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

    @Get('/login')
    @HttpCode(StatusCodes.OK)
    @ApiOkResponse({
        type: LoginUserResponse,
    })
    async login(
        @Query('userId') userId: string,
        @Query('password') password: string,
    ): Promise<LoginUserResponse> {
        const loginUsecaseResponse = await this.loginUseCase.execute({
            userId,
            password,
        })

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
