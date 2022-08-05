import { Body, Controller, Delete, Get, Patch, Post, Put } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';
import { CommonResponse } from '../../common/controller/dto/CommonResponse';
import { CreateUserRequest, UpdateUserRequest } from './dto/UserRequest';
import { GetAllUserResponse } from './dto/UserResponse';

@Controller('user')
@ApiTags('사용자')
export class UserController {
    constructor() {}

    @Post()
    @ApiCreatedResponse({
        type: CommonResponse,
    })
    async create(
        @Body() request: CreateUserRequest,
    ) {}

    @Get()
    @ApiOkResponse({
        type: GetAllUserResponse,
    })
    async getAll() {}

    @Patch('/:userId')
    @ApiResponse({
        type: CommonResponse,
    })
    async update(
        @Body() request: UpdateUserRequest,
    ): Promise<CommonResponse> {
        return {
            code: StatusCodes.NO_CONTENT,
            responseMessage: 'SUCCESS TO UPDATE USER',
        }        
    }

    @Delete('/:userId')
    @ApiResponse({
        type: CommonResponse,
    })
    async delete() {}
}
