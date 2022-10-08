import _ from 'lodash';
import { Body, Controller, Delete, Get, HttpCode, HttpException, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';

import { LocalAuthGuard } from '../../auth/local-auth.gaurd';
import { CommonResponse } from '../../common/controller/dto/CommonResponse';
import { CreateUserUseCase, CreateUserUseCaseCodes } from '../application/CreateUserUseCase/CreateUserUseCase';
import { GetUserUseCase, GetUserUseCaseCodes } from '../application/GetUserUseCase/GetUserUseCase';
import { CreateFriendRequest, CreateUserRequest, LoginRequest, UpdateUserRequest } from './dto/UserRequest';
import { LoginOrSignUpUserResponse, GetAllUserResponse, GetUserResponse } from './dto/UserResponse';
import { GetAllPinUseCase, GetAllPinUseCaseCodes } from '../../pin/application/GetAllPinUseCase/GetAllPinUseCase';
import { UserOwnerGuard } from '../user-owner.guard';
import { FriendOwnerGuard } from '../friend-owner.guard';
import { JwtAuthGuard } from '../../auth/jwt-auth.gaurd';
import { AuthService, JwtPayload } from '../../auth/authServiece';
import { RefreshAuthGuard } from '../../auth/refresh-auth.guard';
import { checkRefreshToken } from '../../auth/refresh.strategy';
import { CreateFriendUseCase, CreateFriendUseCaseCodes } from '../application/CreateFriendUseCase/CreateFriendUseCase';
import { UpdateUserUseCase, UpdateUserUseCaseCodes } from '../application/UpdateUserUseCase/UpdateUserUseCase';
import { GetAllBadgeUseCase, GetAllBadgeUseCaseCodes } from '../../badge/application/GetAllBadgeUseCase/GetAllBadgeUseCase';
import { CreateAchievesUseCase } from '../../badge/application/CreateAchievesUseCase/CreateAchievesUseCase';

@Controller('users')
@ApiTags('사용자')
export class UserController {
    constructor(
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly getUserUseCase: GetUserUseCase,
        private readonly getAllPinUseCase: GetAllPinUseCase,
        private readonly authService: AuthService,
        private readonly createFriendUseCase: CreateFriendUseCase,
        private readonly updateUserUseCase: UpdateUserUseCase,
        private readonly getAllBadgeUseCase: GetAllBadgeUseCase,
        private readonly createAchievesUseCase: CreateAchievesUseCase,
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

        if (createUserUseCaseResponse.code === CreateUserUseCaseCodes.DUPLICATE_LOGIN_ID_AND_NAME_ERROR) {
            throw new HttpException(CreateUserUseCaseCodes.DUPLICATE_LOGIN_ID_AND_NAME_ERROR, StatusCodes.CONFLICT);
        }

        if (createUserUseCaseResponse.code === CreateUserUseCaseCodes.DUPLICATE_LOGIN_ID_ERROR) {
            throw new HttpException(CreateUserUseCaseCodes.DUPLICATE_LOGIN_ID_ERROR, StatusCodes.CONFLICT);
        }

        if (createUserUseCaseResponse.code === CreateUserUseCaseCodes.DUPLICATE_NAME_ERROR) {
            throw new HttpException(CreateUserUseCaseCodes.DUPLICATE_NAME_ERROR, StatusCodes.CONFLICT);
        }

        if (createUserUseCaseResponse.code !== CreateUserUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO CREATE USER', StatusCodes.INTERNAL_SERVER_ERROR);
        }
        
        const user = createUserUseCaseResponse.user;

        // NOTE: 배지 전부 가져옴
        const getAllBadgeUseCaseResponse = await this.getAllBadgeUseCase.execute({});

        if (getAllBadgeUseCaseResponse.code !== GetAllBadgeUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO GET ALL BADGE', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const badges = getAllBadgeUseCaseResponse.badges;

        // NOTE: achieve들 유저랑 엮어서 생성 (기본 status: non_achieve)
        const createAchievesUseCaseResponse = await this.createAchievesUseCase.execute({
            badges,
            user,
        });

        return await this.authService.getToken({
            username: user.loginId.value,
            sub: user.id,
        });
    }

    @Post('/refresh')
    @UseGuards(RefreshAuthGuard)
    @ApiOperation({
        summary: '토큰 리프레시',
        description: '헤더로 받은 refresh token에 해당하는 유저의 토큰을 재생성해서 리턴함.'
    })
    @ApiOkResponse({
        type: LoginOrSignUpUserResponse,
    })
    async refreshToken(
        @Request() request,
    ): Promise<LoginOrSignUpUserResponse> {
        const { refreshToken, sub, username } = request.user as JwtPayload;

        const getUserUseCaseResponse = await this.getUserUseCase.execute({
            id: sub,
        });

        if (getUserUseCaseResponse.code === GetUserUseCaseCodes.NOT_EXIST_USER) {
            throw new HttpException(GetUserUseCaseCodes.NOT_EXIST_USER, StatusCodes.NOT_FOUND);
        }
    
        if (getUserUseCaseResponse.code !== GetUserUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO GET USER', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        if (!(await checkRefreshToken(refreshToken, getUserUseCaseResponse.user))) {
            throw new HttpException('INVALID REFREESH TOKEN', StatusCodes.UNAUTHORIZED);
        }

        const user = getUserUseCaseResponse.user;

        return await this.authService.getToken({
            username: user.loginId.value,
            sub: user.id,
        });
    }

    @Post('/friends')
    @UseGuards(JwtAuthGuard)
    @HttpCode(StatusCodes.CREATED)
    @ApiCreatedResponse({
        type: CommonResponse,
    })
    async createFriend(
        @Body() body: CreateFriendRequest,
        @Request() request,
    ): Promise<CommonResponse> {
        const userResponse = await this.getUserUseCase.execute({
            loginId: body.friendLoginId,
        });

        if (userResponse.code !== GetUserUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO CREATE FRIEND BY USER', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const createFriendUseCaseResponse = await this.createFriendUseCase.execute({
            user: request.user,
            friend: userResponse.user,
        });

        if (createFriendUseCaseResponse.code !== CreateFriendUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO CREATE FRIEND', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        return {
            code: StatusCodes.CREATED,
            responseMessage: 'SUCCESS TO CREATE FRIEND',
        };
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
    async getAllFriends() {
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

        if (getUserUseCaseResponse.code === GetUserUseCaseCodes.DUPLICATE_LOGIN_ID_ERROR) {
            return {
                code: StatusCodes.CONFLICT,
                responseMessage: GetUserUseCaseCodes.DUPLICATE_LOGIN_ID_ERROR,
                isValid: false,
            };
        }

        if (getUserUseCaseResponse.code === GetUserUseCaseCodes.NOT_EXIST_USER) {
            return {
                code: StatusCodes.OK,
                responseMessage: 'Available User ID.',
                isValid: true,
            };
        }

        if (getUserUseCaseResponse.code !== GetUserUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO GET USER ID', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('/checked-name')
    @HttpCode(StatusCodes.OK)
    @ApiOperation({
        summary: '닉네임 중복체크',
        description: '회원가입 시 닉네임이 사용 가능한지 중복 체크해주는 API'
    })
    @ApiOkResponse({
        type: CommonResponse
    })
    async checkName(
        @Query('name') name: string,
    ): Promise<CommonResponse> {
        const getUserUseCaseResponse = await this.getUserUseCase.execute({
            name: name,
            isCheckDuplicated: true,
        });

        if (getUserUseCaseResponse.code === GetUserUseCaseCodes.DUPLICATE_NAME_ERROR) {
            return {
                code: StatusCodes.CONFLICT,
                responseMessage: GetUserUseCaseCodes.DUPLICATE_NAME_ERROR,
                isValid: false,
            };
        }

        if (getUserUseCaseResponse.code === GetUserUseCaseCodes.NOT_EXIST_USER) {
            return {
                code: StatusCodes.OK,
                responseMessage: 'Available User Name.',
                isValid: true,
            };
        }

        if (getUserUseCaseResponse.code !== GetUserUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO GET USER NAME', StatusCodes.INTERNAL_SERVER_ERROR);
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
        @Body() body: LoginRequest,
    ): Promise<LoginOrSignUpUserResponse> {
        const user = request.user;

        return await this.authService.getToken({
            username: user.loginId.value,
            sub: user.id,
        });
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
    ): Promise<GetUserResponse> {
        const user = request.user;

        const getAllPinUseCaseResponse = await this.getAllPinUseCase.execute({
            user,
        });

        if (getAllPinUseCaseResponse.code !== GetAllPinUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO GET ALL PIN', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        return {
            user: {
                id: user.id,
                loginId: user.loginId.value,
                image: user.image ? user.image.value : null,
                name: user.name.value,
                pinCount: getAllPinUseCaseResponse.pins.length,
                goalDistance: user.goalDistance.value,
                goalTime: user.goalTime.value,
                totalDistance: user.totalDistance.value,
                totalTime: user.totalTime.value,
            },
        };
    }

    @Patch('/:userId')
    @UseGuards(UserOwnerGuard)
    @UseGuards(JwtAuthGuard)
    @HttpCode(StatusCodes.NO_CONTENT)
    @ApiOperation({
        summary: '유저 수정 (프로필 수정), 유저 수정되면 수정된 유저 리턴해줍니다. 비번 수정도 됨'
    })
    @ApiResponse({
        type: GetUserResponse,
    })
    async update(
        @Param('userId') userId: string,
        @Request() request,
        @Body() body: UpdateUserRequest,
    ): Promise<GetUserResponse> {
        const updateUserUseCaseResponse = await this.updateUserUseCase.execute({
            id: userId,
            password: body.password,
            name: body.name,
            image: body.image,
            goalDistance: body.goalDistance,
            goalTime: body.goalTime,
        });

        if (updateUserUseCaseResponse.code === UpdateUserUseCaseCodes.NOT_EXIST_USER) {
            throw new HttpException(UpdateUserUseCaseCodes.NOT_EXIST_USER, StatusCodes.NOT_FOUND);
        }

        if (updateUserUseCaseResponse.code === UpdateUserUseCaseCodes.DUPLICATE_USER_NAME_ERROR) {
            throw new HttpException(UpdateUserUseCaseCodes.DUPLICATE_USER_NAME_ERROR, StatusCodes.CONFLICT);
        }
        
        if (updateUserUseCaseResponse.code !== UpdateUserUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO UPDATE USER', StatusCodes.INTERNAL_SERVER_ERROR);
        }   

        const getAllPinUseCaseResponse = await this.getAllPinUseCase.execute({
            user: request.user,
        });

        if (getAllPinUseCaseResponse.code !== GetAllPinUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO UPDATE USER BY FAILING TO GET ALL PIN', StatusCodes.INTERNAL_SERVER_ERROR);
        }
        
        const user = updateUserUseCaseResponse.user;

        return {
            user: {
                id: user.id,
                loginId: user.loginId.value,
                image: user.image ? user.image.value : null,
                name: user.image.value,
                pinCount: getAllPinUseCaseResponse.pins.length,
                goalDistance: user.goalDistance.value,
                goalTime: user.goalTime.value,
                totalDistance: user.totalDistance.value,
                totalTime: user.totalTime.value,
            }
        };
    }

    @Delete('/:userId')
    @UseGuards(UserOwnerGuard)
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
    @UseGuards(FriendOwnerGuard)
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
