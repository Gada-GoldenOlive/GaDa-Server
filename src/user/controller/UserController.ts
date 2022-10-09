import _ from 'lodash';
import { Body, Controller, Delete, Get, HttpCode, HttpException, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';

import { LocalAuthGuard } from '../../auth/local-auth.gaurd';
import { CommonResponse } from '../../common/controller/dto/CommonResponse';
import { CreateUserUseCase, CreateUserUseCaseCodes } from '../application/CreateUserUseCase/CreateUserUseCase';
import { GetUserUseCase, GetUserUseCaseCodes } from '../application/GetUserUseCase/GetUserUseCase';
import { CreateFriendRequest, CreateUserRequest, LoginRequest, UpdateFriendRequest, UpdateUserRequest } from './dto/UserRequest';
import { LoginOrSignUpUserResponse, GetAllUserResponse, GetUserResponse, GetAllFriendResponse, FriendDto, GetAllFriendRequestResponse, FriendRequestDto, UserDto } from './dto/UserResponse';
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
import { GetAllUserUseCase, GetAllUserUseCaseCodes } from '../application/GetAllUserUseCase/GetAllUserUseCase';
import { User } from '../domain/User/User';
import { UpdateFriendUseCase, UpdateFriendUseCaseCodes } from '../application/UpdateFriendUseCase/UpdateFriendUseCase';
import { FriendStatus } from '../domain/Friend/FriendStatus';
import { GetAllFriendUseCase, GetAllFriendUseCaseCodes } from '../application/GetAllFriendUseCase/GetAllFriendUseCase';
import { DeleteFriendUseCase, DeleteFriendUseCaseCodes } from '../application/DeleteFriendUseCase/DeleteFriendUseCase';

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
        private readonly getAllUserUseCase: GetAllUserUseCase,
        private readonly updateFriendUseCase: UpdateFriendUseCase,
        private readonly getAllFriendUseCase: GetAllFriendUseCase,
        private readonly deleteFriendUseCase: DeleteFriendUseCase,
    ) {}

    private async convertToUserDto(user: User): Promise<UserDto> {
        const getAllPinUseCaseResponse = await this.getAllPinUseCase.execute({
            user,
        });

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
            totalDistance: user.totalDistance.value,
            totalTime: user.totalTime.value,
        };
    }

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
        if (request.user.loginId.value === body.friendLoginId) {
            throw new HttpException('CANNOT MAKE FRIEND WITH YOURSELF', StatusCodes.BAD_REQUEST);
        }

        const userResponse = await this.getUserUseCase.execute({
            loginId: body.friendLoginId,
        });

        if (userResponse.code === GetUserUseCaseCodes.NOT_EXIST_USER) {
            throw new HttpException('FAIL TO FIND FRIEND BY LOGIN ID', StatusCodes.INTERNAL_SERVER_ERROR);
        }
        
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
    @ApiOperation({
        summary: '유저 목록 조회',
        description: 'loginId를 주면 loginId에 해당 string을 포함하는, 본인을 제외한 유저 목록을 리턴. / '
        + 'loginId가 주어지지 않으면 전체 유저 목록을 리턴.'
    })
    async getAll(
        @Query('loginId') loginId: string,
        @Request() request,
    ) {
        const getAllUserUseCaseResponse = await this.getAllUserUseCase.execute({
            userId: request.user.id,
            loginId: loginId,
        });

        if (getAllUserUseCaseResponse.code !== GetAllUserUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO GET ALL USER', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const users: UserDto[] = await Promise.all(_.map(getAllUserUseCaseResponse.users, (user) => {
            return this.convertToUserDto(user);
        }));

        return {
            users,
        };
    }

    @Get('/friends')
    @UseGuards(JwtAuthGuard)
    @HttpCode(StatusCodes.OK)
    @ApiOkResponse({
        type: GetAllFriendResponse,
    })
    @ApiOperation({
        summary: '친구 목록 조회',
        description: '토큰에 해당하는 유저의 친구 목록 리턴. / '
        + '본인을 포함한 친구목록을 그 주의 달성거리 순으로 정렬해서 리턴. 본인의 경우 id를 null로 설정 / '
        + '읽지 않은 친구신청이 있는지 여부도 함께 리턴함.'
    })
    async getAllFriends(
        @Request() request,
    ): Promise<GetAllFriendResponse> {
        const getAllFriendUseCaseResponse = await this.getAllFriendUseCase.execute({
            userId: request.user.id,
            isRank: true,
        });

        if (getAllFriendUseCaseResponse.code !== GetAllFriendUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO GET ALL FRIENDS', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        //NOTE: accepted인 friend만 필터링하고 / friend user1, user2 중 친구를 찾아서 friendId와 함께 리턴.
        let _friends = _.map(_.filter(getAllFriendUseCaseResponse.friends, (friend) => {
            return friend.status === FriendStatus.ACCEPTED;
        }), (friend) => {
            let user = friend.user1;

            if (friend.user1.id === request.user.id) {
                user = friend.user2;
            }

            return {
                id: friend.id,
                user: user,
            };
        });

        _friends.push({
            id: null,
            user: request.user,
        });

        _friends = _friends.sort((a, b) => {
            // TODO: 일단 totalDistance로 정렬 했는데, record관련 usecase 구현하고 나면 record.distance로 수정해야함.
            return b.user.totalDistance.value - a.user.totalDistance.value;
        });

        const friends = _.map(_friends, function(friend): FriendDto {
            return {
                id: friend.id,
                userId: friend.user.id,
                name: friend.user.name.value,
                image: friend.user.image.value,
                // TODO: 얘도 record 구현하고 나면 record.distance로 수정해야함.
                distance: friend.user.totalDistance.value,
            };
        });

        const is_exist_unread_request = !_.isEmpty(_.filter(getAllFriendUseCaseResponse.friends, (friend) => {
            return (friend.user2.id === request.user.id && friend.status === FriendStatus.REQUESTED);
        }));

        return {
            friends,
            is_exist_unread_request,
        };
    }

    @Get('/friend-requests')
    @UseGuards(JwtAuthGuard)
    @HttpCode(StatusCodes.OK)
    @ApiOkResponse({
        type: GetAllFriendRequestResponse,
    })
    @ApiOperation({
        summary: '친구 신청 목록 조회',
        description: '토큰에 해당하는 유저의 친구신청 목록을 최신순으로 정렬해서 리턴.'
    })
    async getAllFriendRequests(
        @Request() request,
    ): Promise<GetAllFriendRequestResponse> {
        const getAllFriendUseCaseResponse = await this.getAllFriendUseCase.execute({
            userId: request.user.id,
            isRank: false,
        });

        if (getAllFriendUseCaseResponse.code !== GetAllFriendUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO GET ALL FRIEND REQUESTS', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const requests = _.map((getAllFriendUseCaseResponse.friends), function(friend): FriendRequestDto {
            let user = friend.user1;

            if (friend.user1.id === request.user.id) {
                user = friend.user2;
            }

            return {
                id: friend.id,
                userId: user.id,
                name: user.name.value,
                image: user.image.value,
                loginId: user.loginId.value,
            };
        });

        const unread_requests = _.filter(getAllFriendUseCaseResponse.friends, (friend) => {
            return (friend.status === FriendStatus.REQUESTED);
        });

        await Promise.all(_.map(unread_requests, async (friend) => {
            const updateFriendUseCaseResponse = await this.updateFriendUseCase.execute({
                id: friend.id,
                status: FriendStatus.READ,
            });

            if (updateFriendUseCaseResponse.code !== UpdateFriendUseCaseCodes.SUCCESS) {
                throw new HttpException('FAIL TO UPDATE FRIEND', StatusCodes.INTERNAL_SERVER_ERROR);
            }
        }));

        return {
            requests,
        };
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

        return {
            user: await this.convertToUserDto(user),
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

        const user = updateUserUseCaseResponse.user;

        return {
            user: await this.convertToUserDto(user),
        };
    }

    @Patch('/friends/:friendId')
    @UseGuards(FriendOwnerGuard)
    @UseGuards(JwtAuthGuard)
    @HttpCode(StatusCodes.NO_CONTENT)
    @ApiResponse({
        type: CommonResponse
    })
    @ApiOperation({
        summary: '친구 수정',
        description: '[status] \'ACCEPTED\': 수락 / \'REJECTED\': 거절 / \'DELETE\': 삭제'
    })
    async updateFriend(
        @Param('friendId') friendId: string,
        @Body() body: UpdateFriendRequest,
    ): Promise<CommonResponse> {
        const updateFriendUseCaseResponse = await this.updateFriendUseCase.execute({
            id: friendId,
            status: body.status, 
        });

        if (updateFriendUseCaseResponse.code === UpdateFriendUseCaseCodes.NOT_EXIST_FRIEND) {
            throw new HttpException(UpdateFriendUseCaseCodes.NOT_EXIST_FRIEND, StatusCodes.NOT_FOUND);
        }

        if (updateFriendUseCaseResponse.code !== UpdateFriendUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO UPDATE FRIEND', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        return {
            code: StatusCodes.NO_CONTENT,
            responseMessage: 'SUCCESS TO UPDATE FRIEND',
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
    @ApiOperation({
        summary: '친구 삭제',
    })
    async deleteFriend(
        @Param('friendId') friendId: string,
    ): Promise<CommonResponse> {
        const deleteFriendUseCaseResponse = await this.deleteFriendUseCase.execute({
            id: friendId,
        });

        if (deleteFriendUseCaseResponse.code === DeleteFriendUseCaseCodes.NOT_EXIST_FRIEND) {
            throw new HttpException(DeleteFriendUseCaseCodes.NOT_EXIST_FRIEND, StatusCodes.NOT_FOUND);
        }

        if (deleteFriendUseCaseResponse.code !== DeleteFriendUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO DELETE FRIEND', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        return {
            code: StatusCodes.NO_CONTENT,
            responseMessage: 'SUCCESS TO DELETE FRIEND',
        };
    }
}
