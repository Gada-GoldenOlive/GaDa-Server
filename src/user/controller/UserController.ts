import _ from 'lodash';
import { Body, Controller, Delete, Get, HttpCode, HttpException, Logger, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';
import { Cron } from '@nestjs/schedule';

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
import { CreateAchievesUseCase, CreateAchievesUseCaseCodes } from '../../badge/application/CreateAchievesUseCase/CreateAchievesUseCase';
import { GetAllUserUseCase, GetAllUserUseCaseCodes } from '../application/GetAllUserUseCase/GetAllUserUseCase';
import { initialNumber, User } from '../domain/User/User';
import { UpdateFriendUseCase, UpdateFriendUseCaseCodes } from '../application/UpdateFriendUseCase/UpdateFriendUseCase';
import { FriendStatus } from '../domain/Friend/FriendStatus';
import { GetAllFriendUseCase, GetAllFriendUseCaseCodes } from '../application/GetAllFriendUseCase/GetAllFriendUseCase';
import { DeleteFriendUseCase, DeleteFriendUseCaseCodes } from '../application/DeleteFriendUseCase/DeleteFriendUseCase';
import { DeleteUserUseCase, DeleteUserUseCaseCodes } from '../application/DeleteUserUseCase/DeleteUserUseCase';
import { BadgeCategory, BADGE_CATEGORY } from '../../badge/domain/Badge/BadgeCategory';
import { BadgeCode, BADGE_CODE } from '../../badge/domain/Badge/BadgeCode';
import { Achieve } from '../../badge/domain/Achieve/Achieve';
import { GetAchieveUseCase, GetAchieveUseCaseCodes } from '../../badge/application/GetAchieveUseCase/GetAchieveUseCase';
import { UpdateAchieveUseCase, UpdateAchieveUseCaseCodes } from '../../badge/application/UpdateAchieveUseCase/UpdateAchieveUseCase';
import { AchieveStatus } from '../../badge/domain/Achieve/AchieveStatus';
import {GetFriendUseCase, GetFriendUseCaseCodes} from "../application/GetFriendUseCase/IGetFriendUseCase";

@Controller('users')
@ApiTags('사용자')
export class UserController {
    private achieves: Achieve[] = [];

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
        private readonly getFriendUseCase: GetFriendUseCase,
        private readonly getAllFriendUseCase: GetAllFriendUseCase,
        private readonly deleteFriendUseCase: DeleteFriendUseCase,
        private readonly deleteUserUseCase: DeleteUserUseCase,
        private readonly getAchieveUseCase: GetAchieveUseCase,
        private readonly updateAchieveUseCase: UpdateAchieveUseCase,
    ) {}

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
            weekDistance: user.weekDistance.value,
            weekTime: user.weekTime.value,
        };
    }

    @Cron('0 0 0 * * 1')
    async resetWeeklyRecord() {
        const getAllUserUseCaseResponse = await this.getAllUserUseCase.execute({});

        if (getAllUserUseCaseResponse.code !== GetAllUserUseCaseCodes.SUCCESS) {
            throw new Error('FAIL TO GET ALL USER');
        }

        const users = getAllUserUseCaseResponse.users;

        await Promise.all(_.map(users, async (user) => {
            // TODO: user의 weekDistance, weekTime 값으로 Record 생성

            const updateUserUseCaseResponse = await this.updateUserUseCase.execute({
                id: user.id,
                weekDistance: initialNumber,
                weekTime: initialNumber,
            });

            if (updateUserUseCaseResponse.code === UpdateUserUseCaseCodes.NOT_EXIST_USER) {
                Logger.error('FAIL TO FIND USER BY USERID: ' + user.id);
            }

            if (updateUserUseCaseResponse.code !== UpdateUserUseCaseCodes.SUCCESS) {
                Logger.error('FAIL TO UPDATE USER ' + user.loginId);
            }
        }));
    }

    @Post()
    @HttpCode(StatusCodes.CREATED)
    @ApiCreatedResponse({
        type: LoginOrSignUpUserResponse,
    })
    @ApiOperation({
        summary: '유저 생성 (배지 리턴)',
        description: '1. 유저를 생성한 뒤, 해당 유저의 토큰을 리턴한다.<br>'
        + '2. 회원가입 완료! 배지 리턴됨'
    })
    async create(
        @Body() request: CreateUserRequest,
    ): Promise<LoginOrSignUpUserResponse> {
        this.achieves = [];
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

        if (createAchievesUseCaseResponse.code !== CreateAchievesUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO CREATE ACHIEVES', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        await this.pushAchieve(user, BadgeCategory.USER, BadgeCode.FIRST, this.achieves);

        const { accessToken, refreshToken } = await this.authService.getToken({
            username: user.loginId.value,
            sub: user.id,
        });

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
            responseMessage: 'SUCCESS TO CREATE USER',
            accessToken,
            refreshToken,
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
        const { refreshToken: requestRefreshToken, sub, username } = request.user as JwtPayload;

        const getUserUseCaseResponse = await this.getUserUseCase.execute({
            id: sub,
        });

        if (getUserUseCaseResponse.code === GetUserUseCaseCodes.NOT_EXIST_USER) {
            throw new HttpException(GetUserUseCaseCodes.NOT_EXIST_USER, StatusCodes.NOT_FOUND);
        }
    
        if (getUserUseCaseResponse.code !== GetUserUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO GET USER', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        if (!(await checkRefreshToken(requestRefreshToken, getUserUseCaseResponse.user))) {
            throw new HttpException('INVALID REFREESH TOKEN', StatusCodes.UNAUTHORIZED);
        }

        const user = getUserUseCaseResponse.user;

        const { accessToken, refreshToken } = await this.authService.getToken({
            username: user.loginId.value,
            sub: user.id,
        });

        return {
            code: StatusCodes.NO_CONTENT,
            responseMessage: 'SUCCESS TO REFRESH TOKEN',
            accessToken,
            refreshToken,
        };
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

        const { accessToken, refreshToken } = await this.authService.getToken({
            username: user.loginId.value,
            sub: user.id,
        });

        return {
            code: StatusCodes.OK,
            responseMessage: 'SUCCESS TO LOGIN',
            accessToken,
            refreshToken,
        };
    }

    @Post('/friends')
    @UseGuards(JwtAuthGuard)
    @HttpCode(StatusCodes.CREATED)
    @ApiOperation({
        summary: 'loginId에 해당하는 유저에게 친구 신청 (배지 리턴)',
        description: '첫 친구 신청시 "처음 친구 신청!" 배지 리턴됨'
    })
    @ApiCreatedResponse({
        type: CommonResponse,
    })
    async createFriend(
        @Body() body: CreateFriendRequest,
        @Request() request,
    ): Promise<CommonResponse> {
        this.achieves = [];

        // NOTE: 자기자신인지 체크
        if (request.user.loginId.value === body.friendLoginId) {
            throw new HttpException('CANNOT MAKE FRIEND WITH YOURSELF', StatusCodes.BAD_REQUEST);
        }

        // NOTE: loginId로 친구 가져오기
        const userResponse = await this.getUserUseCase.execute({
            loginId: body.friendLoginId,
        });

        if (userResponse.code === GetUserUseCaseCodes.NOT_EXIST_USER) {
            throw new HttpException('FAIL TO FIND FRIEND BY LOGIN ID', StatusCodes.INTERNAL_SERVER_ERROR);
        }
        
        if (userResponse.code !== GetUserUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO CREATE FRIEND BY USER', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        // NOTE: 이미 friend가 존재하는지 알기 위해 user1, user2로 검색
        const getFriendUseCaseResponse = await this.getFriendUseCase.execute({
            user1: request.user,
            user2: userResponse.user,
        });

        if (getFriendUseCaseResponse.code !== GetFriendUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO FIND FRIEND BY USERS', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        // NOTE: 이미 friend가 존재한다면 status를 REQUESTED로 변경
        if (getFriendUseCaseResponse.friend) {
            const updateFriendUseCaseResponse = await this.updateFriendUseCase.execute({
                id: getFriendUseCaseResponse.friend.id,
                status: FriendStatus.REQUESTED,
            });
        }

        // NOTE: 존재하지 않는다면 friend 생성
        else {
            const createFriendUseCaseResponse = await this.createFriendUseCase.execute({
                user: request.user,
                friend: userResponse.user,
            });

            if (createFriendUseCaseResponse.code !== CreateFriendUseCaseCodes.SUCCESS) {
                throw new HttpException('FAIL TO CREATE FRIEND', StatusCodes.INTERNAL_SERVER_ERROR);
            }
        }

        await this.pushAchieve(request.user, BadgeCategory.FRIEND, BadgeCode.FIRST, this.achieves);

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
                responseMessage: 'SUCCESS TO CREATE FRIEND AND GET BADGE',
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
        summary: '유저 목록 조회 (친구검색)',
        description: 'loginId에 해당 string을 포함하는, 본인을 제외한 유저 목록을 리턴. / '
        + '이미 친구신청을 했거나, 수락한 유저는 제외.',
    })
    async getAll(
        @Query('loginId') loginId: string,
        @Request() request,
    ) {
        const getAllUserUseCaseResponse = await this.getAllUserUseCase.execute({
            loginId: loginId,
        });

        if (getAllUserUseCaseResponse.code !== GetAllUserUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO GET ALL USER', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const getAllFriendUseCaseResponse = await this.getAllFriendUseCase.execute({
            userId: request.user.id,
            isRank: true,
        });

        if (getAllFriendUseCaseResponse.code !== GetAllFriendUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO GET ALL FRIENDS', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const friendIds = _.map(getAllFriendUseCaseResponse.friends, (friend) => {
            if (friend.user1.id === request.user.id) {
                return friend.user2.id;
            }
            return friend.user1.id;
        });

        const nonFriendUsers = getAllUserUseCaseResponse.users.filter((user) => {
                if (user.id === request.user.id) return false;
                
                return !friendIds.includes(user.id);
            });

        const users: UserDto[] = await Promise.all(_.map(nonFriendUsers, (user) => {
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
        summary: '친구 목록 조회 (배지 리턴)',
        description: '1. 토큰에 해당하는 유저의 친구 목록 리턴.<br>'
        + '- 본인을 포함한 친구목록을 그 주의 달성거리 순으로 정렬해서 리턴. 본인의 경우 id를 null로 설정<br>'
        + '- 읽지 않은 친구신청이 있는지 여부도 함께 리턴함.<br>'
        + '2. "친구 n명 달성!" 혹은 "1위 달성!" 배지 리턴될 수 있음<br>'
        + '- status가 NON_ACHIEVE면 일반 배지, HIDDEN이면 히든 배지<br>'
        + '- 여러 개 동시에 리턴 가능'
    })
    async getAllFriends(
        @Request() request,
    ): Promise<GetAllFriendResponse> {
        this.achieves = [];

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
            return b.user.weekDistance.value - a.user.weekDistance.value;
        });

        // NOTE: 친구 둘 이상이고 내가 1등
        if (_friends.length > 1 && _friends[0].user === request.user) {
            await this.pushAchieve(request.user, BadgeCategory.FRIEND, BadgeCode.BEST, this.achieves);
        }

        // NOTE: 나 빼고 친구수 달성
        if (_friends.length - 1 >= 50) {
            await this.pushAchieve(request.user, BadgeCategory.FRIEND, BadgeCode.FIFTY, this.achieves);
        }
        if (_friends.length - 1 >= 20) {
            await this.pushAchieve(request.user, BadgeCategory.FRIEND, BadgeCode.TWENTY, this.achieves);
        }
        if (_friends.length - 1 >= 10) {
            await this.pushAchieve(request.user, BadgeCategory.FRIEND, BadgeCode.TEN, this.achieves);
        }
        if (_friends.length - 1 >= 5) {
            await this.pushAchieve(request.user, BadgeCategory.FRIEND, BadgeCode.FIVE, this.achieves);
        }
        if (_friends.length - 1 >= 3) {
            await this.pushAchieve(request.user, BadgeCategory.FRIEND, BadgeCode.THREE, this.achieves);
        }

        const friends = _.map(_friends, function(friend): FriendDto {
            return {
                id: friend.id,
                userId: friend.user.id,
                name: friend.user.name.value,
                image: friend.user.image ? friend.user.image.value : null,
                distance: friend.user.weekDistance.value,
            };
        });

        const is_exist_unread_request = !_.isEmpty(_.filter(getAllFriendUseCaseResponse.friends, (friend) => {
            return (friend.user2.id === request.user.id && friend.status === FriendStatus.REQUESTED);
        }));

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
                code: StatusCodes.OK,
                responseMessage: 'SUCCESS TO GET FRIEND LIST AND GET BADGE',
                friends,
                is_exist_unread_request,
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
            code: StatusCodes.OK,
            responseMessage: 'SUCCESS TO GET FRIEND LIST',
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
                image: user.image ? user.image.value : null,
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
            code: StatusCodes.OK,
            responseMessage: 'SUCCESS TO GET ALL FRIEND REQUEST',
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

    @Get('/check-token')
    @HttpCode(StatusCodes.OK)
    @ApiOperation({
        summary: 'token 유효성 체크',
        description: '헤더로 받은 token이 유효한 토큰인지 여부를 isValid로 리턴.'
    })
    @ApiOkResponse({
        type: CommonResponse,
    })
    async checkToken(
        @Request() request,
    ): Promise<CommonResponse> {
        const token = request.headers.authorization.split('Bearer ')[1];

        const verify = await this.authService.checkToken(token);

        if (verify) {
            return {
                code: StatusCodes.OK,
                responseMessage: 'Valid Token',
                isValid: true,
            };
        }
        return {
            code: StatusCodes.OK,
            responseMessage: 'Invalid Token',
            isValid: false,
        };
    }

    @Get('/:userId')
    @UseGuards(JwtAuthGuard)
    @HttpCode(StatusCodes.OK)
    @ApiOperation({
        summary: '개별 유저 정보 조회',
        description: 'userId에 해당하는 유저 정보를 리턴함.'
    })
    @ApiOkResponse({
        type: GetUserResponse,
    })
    async getOne(
        @Request() request,
        @Param('userId') userId: string,
    ): Promise<GetUserResponse> {
        const getUserUseCaseResponse = await this.getUserUseCase.execute({
            id: userId,
        });
    
        if (getUserUseCaseResponse.code === GetUserUseCaseCodes.NOT_EXIST_USER) {
            throw new HttpException(GetUserUseCaseCodes.NOT_EXIST_USER, StatusCodes.NOT_FOUND);
        }
    
        if (getUserUseCaseResponse.code !== GetUserUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO GET USER', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const user = getUserUseCaseResponse.user;

        return {
            code: StatusCodes.OK,
            responseMessage: 'SUCCESS TO GET USER DETAIL',
            user: await this.convertToUserDto(user),
        };
    }

    @Patch('/:userId')
    @UseGuards(UserOwnerGuard)
    @UseGuards(JwtAuthGuard)
    @HttpCode(StatusCodes.OK)
    @ApiOperation({
        summary: '유저 수정 (프로필 수정) (배지 리턴)',
        description: '1. 유저 수정되면 수정된 유저 리턴해줍니다. 비번 수정도 됨<br>'
        + '2. 목표 거리 설정! / 목표 시간 설정! 배지 리턴 가능<br>'
        + '- status가 NON_ACHIEVE면 일반 배지, HIDDEN이면 히든 배지<br>'
        + '- 두 개 동시에 리턴될 수 있음<br>'
        + '- goalDistance, goalTime이 존재하는지를 기준으로 삼기 때문에 0으로 설정해도 리턴될 거임'
    })
    @ApiResponse({
        type: GetUserResponse,
    })
    async update(
        @Param('userId') userId: string,
        @Request() request,
        @Body() body: UpdateUserRequest,
    ): Promise<GetUserResponse> {
        this.achieves = [];

        const updateUserUseCaseResponse = await this.updateUserUseCase.execute({
            id: userId,
            originPassword: body.originPassword,
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
        
        if (updateUserUseCaseResponse.code === UpdateUserUseCaseCodes.WRONG_PASSWORD) {
            throw new HttpException(UpdateUserUseCaseCodes.WRONG_PASSWORD, StatusCodes.BAD_REQUEST);
        }
        
        if (updateUserUseCaseResponse.code !== UpdateUserUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO UPDATE USER', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const user = updateUserUseCaseResponse.user;

        if (user.goalDistance) {
            await this.pushAchieve(user, BadgeCategory.DISTANCE, BadgeCode.FIRST, this.achieves);
        }
        if (user.goalTime) {
            await this.pushAchieve(user, BadgeCategory.WALKTIME, BadgeCode.FIRST, this.achieves);
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
                code: StatusCodes.OK,
                responseMessage: 'SUCCESS TO UPDATE USER AND GET BADGE',
                user: await this.convertToUserDto(user),
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
            code: StatusCodes.OK,
            responseMessage: 'SUCCESS TO UPDATE USER',
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
        summary: '친구 수정 (수락 / 거절 / 삭제)',
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
    @ApiOperation({
        summary: '유저 삭제 (회원 탈퇴)',
    })
    async delete(
        @Param('userId') userId: string,
        @Request() request,
    ): Promise<CommonResponse> {
        const deleteUserUsecaseResponse = await this.deleteUserUseCase.execute({
            user: request.user,
        });

        if (deleteUserUsecaseResponse.code === DeleteUserUseCaseCodes.NOT_EXIST_USER) {
            throw new HttpException(DeleteUserUseCaseCodes.NOT_EXIST_USER, StatusCodes.NOT_FOUND);
        }

        if (deleteUserUsecaseResponse.code !== DeleteUserUseCaseCodes.SUCCESS) {
            throw new HttpException('FAIL TO DELETE USER', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        return {
            code: StatusCodes.NO_CONTENT,
            responseMessage: 'SUCCESS TO DELETE USER',
        };
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
