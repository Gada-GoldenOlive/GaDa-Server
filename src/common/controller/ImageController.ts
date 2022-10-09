import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { StatusCodes } from 'http-status-codes';

import { CreatePreSignedUrlResponse } from '../../review/controller/dto/ReviewResponse';

const s3 = new AWS.S3({
	endpoint: `s3.ap-northeast-2.amazonaws.com`,
});
const BucketName = 'golden-olive-gada';
const Expires = 3600;

@Controller('images')
@ApiTags('이미지 관련 공통 작업')
export class ImageController {
	private s3: AWS.S3 = null;

	constructor(
		private readonly config: ConfigService,
	) {
		const region = process.env.AWS_REGION;
		
		AWS.config.update({
			region,
			credentials: {
				accessKeyId: process.env.AWS_ACCESS_KEY_ID,
				secretAccessKey: process.env.AWS_SECRET_KEY,
			},
			apiVersion: '2006-03-01',
			signatureVersion: 'v4',
		});
	}

	@Post('/pre-signed-url')
    @HttpCode(StatusCodes.CREATED)
    @ApiCreatedResponse({
        type: CreatePreSignedUrlResponse,
    })
    async getPreSignedUrl(
        @Body() body: CreatePreSignedUrlResponse,
    ): Promise<CreatePreSignedUrlResponse> {
        const imageId = uuidv4();
        // const key = `${imageId}`;
        const fileName: string = `${imageId}.png`;

        const params = {
            Bucket: BucketName,
            Key: fileName,
            Expires,
            ACL: 'public-read',
        };

        const url = await s3.getSignedUrlPromise('putObject', params);

        return {
            url,
        };
    }
}