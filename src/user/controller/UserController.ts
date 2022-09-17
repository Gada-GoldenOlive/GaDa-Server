import _ from 'lodash';
import { Body, Controller, Delete, Get, HttpCode, HttpException, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';

import { CommonResponse } from '../../common/controller/dto/CommonResponse';
import { CreateUserUseCase, CreateUserUseCaseCodes } from '../application/CreateUserUseCase/CreateUserUseCase';
import { GetUserUseCase, GetUserUseCaseCodes } from '../application/GetUserUseCase/GetUserUseCase';
import { LoginUseCase, LoginUseCaseCodes } from '../application/LoginUseCase/LoginUseCase';
import { CreateFriendRequest, CreateUserRequest, UpdateUserRequest } from './dto/UserRequest';
import { LoginOrSignUpUserResponse, GetAllUserResponse, GetUserResponse } from './dto/UserResponse';
import { GetAllPinUseCase, GetAllPinUseCaseCodes } from '../../pin/application/GetAllPinUseCase/GetAllPinUseCase';

@Controller('users')
@ApiTags('사용자')
export class UserController {
    constructor(
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly loginUseCase: LoginUseCase,
        private readonly getUserUseCase: GetUserUseCase,
        private readonly getAllPinUseCase: GetAllPinUseCase,
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
            loginId: request.loginId,
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

    @Post('/friends')
    @HttpCode(StatusCodes.CREATED)
    @ApiCreatedResponse({
        type: CommonResponse,
    })
    async createFriend(
        @Body() request: CreateFriendRequest,
    ): Promise<CommonResponse> {
        // TODO: 차후 UseCase 생성 시 추가
        throw new Error('Method not implemented');
    }

    @Get()
    @HttpCode(StatusCodes.OK)
    @ApiOkResponse({
        type: GetAllUserResponse,
    })
    async getAll() {
        // TODO: 차후 Usecase 생성시 추가
        throw new Error('Method not implemented');
    }

    @Get('/friends')
    @HttpCode(StatusCodes.OK)
    @ApiOkResponse({
        type: GetAllUserResponse,
    })
    @ApiOperation({
        description: 'userId(uuid)에 해당하는 유저의 친구 목록 리턴'
    })
    async getAllFriends(
        @Query('userId') userId: string,
    ) {
        // TODO: 차후 Usecase 생성시 추가
        throw new Error('Method not implemented');
    }

    @Get('/checked-id')
    @HttpCode(StatusCodes.OK)
    @ApiOperation({
        description: '회원가입 시 id가 사용 가능한지 중복 체크해주는 API'
    })
    @ApiOkResponse({
        type: CommonResponse
    })
    async checkId(
        @Query('loginId') loginId: string,
    ): Promise<CommonResponse> {
        const getUserUseCaseResponse = await this.getUserUseCase.execute({
            loginId: loginId,
            isCheckDuplicated: true,
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
        @Query('loginId') loginId: string,
        @Query('password') password: string,
    ): Promise<LoginOrSignUpUserResponse> {
        const loginUsecaseResponse = await this.loginUseCase.execute({
            loginId,
            password,
        })

        if (loginUsecaseResponse.code === LoginUseCaseCodes.WRONG_LOGIN_ID) {
            throw new HttpException(LoginUseCaseCodes.WRONG_LOGIN_ID, StatusCodes.NOT_FOUND);
        }

        if (loginUsecaseResponse.code === LoginUseCaseCodes.WRONG_PASSWORD) {
            throw new HttpException(LoginUseCaseCodes.WRONG_PASSWORD, StatusCodes.BAD_REQUEST);
        }

        if (loginUsecaseResponse.code === LoginUseCaseCodes.PROPS_VALUES_ARE_REQUIRED) {
            throw new HttpException(LoginUseCaseCodes.PROPS_VALUES_ARE_REQUIRED, StatusCodes.BAD_REQUEST);
        }

        if (loginUsecaseResponse.code !== LoginUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO LOGIN', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const user = loginUsecaseResponse.user;

        return {
            id: user.id,
        }
    }
    
    @Get('/:userId')
    @HttpCode(StatusCodes.OK)
    @ApiOperation({
        description: 'user의 uuid로 유저를 return해주는 API'
    })
    @ApiOkResponse({
        type: GetUserResponse,
    })
    async getOne(
        @Param('userId') userId: string,
    ) {
        const getUserUseCaseResponse = await this.getUserUseCase.execute({
            id: userId,
        });

        if (getUserUseCaseResponse.code === GetUserUseCaseCodes.NO_EXIST_USER) {
            throw new HttpException(GetUserUseCaseCodes.NO_EXIST_USER, StatusCodes.NOT_FOUND);
        }

        if (getUserUseCaseResponse.code !== GetUserUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO GET USER', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const user = getUserUseCaseResponse.user;

        const getAllPinUseCaseResponse = await this.getAllPinUseCase.execute({
            user,
        })

        if (getAllPinUseCaseResponse.code !== GetAllPinUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO GET ALL PIN', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        return {
            id: user.id,
            loginId: user.loginId.value,
            image: user.image ? user.image.value : null,
            name: user.name.value,
            pinCount: getAllPinUseCaseResponse.pins.length,
            goalDistance: user.goalDistance.value,
            goalTime: user.goalTime.value,
            totalDistnace: user.totalDistance.value,
            totalTime: user.totalTime.value,
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
        throw new Error('Method not implemented');
    }

    @Delete('/:userId')
    @HttpCode(StatusCodes.NO_CONTENT)
    @ApiResponse({
        type: CommonResponse,
    })
    async delete(): Promise<CommonResponse> {
        // TODO: 차후 Usecase 생성시 추가
        throw new Error('Method not implemented');
    }

    @Delete('/friends/:friendId')
    @HttpCode(StatusCodes.NO_CONTENT)
    @ApiResponse({
        type: CommonResponse
    })
    async deleteFriend(
        @Param('friendId') friendId: string,
    ): Promise<CommonResponse> {
        // TODO: 차후 UseCase 생성 시 추가
        throw new Error('Method not implemented');
    }
}
