import _ from 'lodash';
import { Body, Controller, Delete, Get, HttpCode, HttpException, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { LocalAuthGuard } from '../../auth/local-auth.gaurd';
import { CommonResponse } from '../../common/controller/dto/CommonResponse';
import { CreateUserUseCase, CreateUserUseCaseCodes } from '../application/CreateUserUseCase/CreateUserUseCase';
import { GetUserUseCase, GetUserUseCaseCodes } from '../application/GetUserUseCase/GetUserUseCase';
import { CreateFriendRequest, CreateUserRequest, UpdateUserRequest } from './dto/UserRequest';
import { LoginOrSignUpUserResponse, GetAllUserResponse, GetUserResponse } from './dto/UserResponse';
import { GetAllPinUseCase, GetAllPinUseCaseCodes } from '../../pin/application/GetAllPinUseCase/GetAllPinUseCase';
import { JwtAuthGuard } from '../../auth/jwt-auth.gaurd';
import { UpdateUserUseCase, UpdateUserUseCaseCodes } from '../application/UpdateUserUseCase/UpdateUserUseCase';

@Controller('users')
@ApiTags('사용자')
export class UserController {
    constructor(
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly getUserUseCase: GetUserUseCase,
        private readonly getAllPinUseCase: GetAllPinUseCase,
        private readonly jwtService: JwtService,
        private readonly configServiece: ConfigService,
        private readonly updateUserUseCase: UpdateUserUseCase,
    ) {}

    @Post()
    @HttpCode(StatusCodes.CREATED)
    @ApiCreatedResponse({
        type: LoginOrSignUpUserResponse,
    })
    @ApiOperation({
        summary: '유저 생성',
        description: '유저를 생성한 뒤, 해당 유저의 토큰을 리턴한다.'
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
            access_token: this.jwtService.sign(
                { username: user.loginId.value, sub: user.id }, 
                { secret: this.configServiece.get('JWT_SECRET') }
            ),
        };
    }

    @Post('/friends')
    @UseGuards(JwtAuthGuard)
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
    @UseGuards(JwtAuthGuard)
    @HttpCode(StatusCodes.OK)
    @ApiOkResponse({
        type: GetAllUserResponse,
    })
    async getAll() {
        // TODO: 차후 Usecase 생성시 추가
        throw new Error('Method not implemented');
    }

    @Get('/friends')
    @UseGuards(JwtAuthGuard)
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
        summary: 'id 중복체크',
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

        if (getUserUseCaseResponse.code === GetUserUseCaseCodes.NO_EXIST_USER) {
            return {
                code: StatusCodes.OK,
                responseMessage: 'Available User ID.',
                isValid: true,
            }
        }

        if (getUserUseCaseResponse.code !== GetUserUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO GET USER ID', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('/login')
    @UseGuards(LocalAuthGuard)
    @HttpCode(StatusCodes.OK)
    @ApiOkResponse({
        type: LoginOrSignUpUserResponse,
    })
    @ApiOperation({
        summary: '로그인',
        description: 'loginId, password에 해당하는 유저가 존재한다면, 유저의 토큰을 리턴한다.'
    })
    async login(
        @Request() request,
    ): Promise<LoginOrSignUpUserResponse> {
        const user = request.user;

        return {
            access_token: this.jwtService.sign(
                { username: user.loginId.value, sub: user.id }, 
                { secret: this.configServiece.get('JWT_SECRET') }
            ),
        };
    }
    
    @Get('/detail')
    @UseGuards(JwtAuthGuard)
    @HttpCode(StatusCodes.OK)
    @ApiOperation({
        summary: '개별 유저 정보 조회',
        description: 'token에 해당하는 유저 정보를 리턴함.'
    })
    @ApiOkResponse({
        type: GetUserResponse,
    })
    async getOne(
        @Request() request,
    ) {
        const user = request.user;

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
    @UseGuards(JwtAuthGuard)
    @HttpCode(StatusCodes.NO_CONTENT)
    @ApiResponse({
        type: CommonResponse,
    })
    async update(
        @Param('userId') userId: string,
        @Request() request,
    ): Promise<CommonResponse> {
        const body: UpdateUserRequest = request.body;

        const updateUserUseCaseResponse = await this.updateUserUseCase.execute({
            id: userId,
            loginId: body.loginId,
            password: body.password,
            name: body.name,
            image: body.image,
            goalDistance: body.goalDistance,
            goalTime: body.goalTime,
        });

        if (updateUserUseCaseResponse.code === UpdateUserUseCaseCodes.NO_EXIST_USER) {
            throw new HttpException(UpdateUserUseCaseCodes.NO_EXIST_USER, StatusCodes.NOT_FOUND);
        }

        if (updateUserUseCaseResponse.code == UpdateUserUseCaseCodes.DUPLICATE_USER_ID_ERROR) {
            throw new HttpException(UpdateUserUseCaseCodes.DUPLICATE_USER_ID_ERROR, StatusCodes.CONFLICT);
        }
        
        if (updateUserUseCaseResponse.code !== UpdateUserUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO UPDATE USER', StatusCodes.INTERNAL_SERVER_ERROR);
        }   
        
        return {
            code: StatusCodes.NO_CONTENT,
            responseMessage: 'SUCCESS TO UPDATE USER',
        };
    }

    @Delete('/:userId')
    @UseGuards(JwtAuthGuard)
    @HttpCode(StatusCodes.NO_CONTENT)
    @ApiResponse({
        type: CommonResponse,
    })
    async delete(): Promise<CommonResponse> {
        // TODO: 차후 Usecase 생성시 추가
        throw new Error('Method not implemented');
    }

    @Delete('/friends/:friendId')
    @UseGuards(JwtAuthGuard)
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
