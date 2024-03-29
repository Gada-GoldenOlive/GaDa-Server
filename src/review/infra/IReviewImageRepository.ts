import { Image } from '../../common/domain/Image/Image';
import { GetAllReviewImageOptions } from './mysql/MysqlReviewImageRepository';

export const REVIEW_IMAGE_REPOSITORY = Symbol('REVIEW_IMAGE_REPOSITORY');

export interface IReviewImageRepository {
	getAll(options: GetAllReviewImageOptions): Promise<Image[]>;
	saveAll(reviewImages: Image[]): Promise<boolean>;
	deleteAll(ids: string[]): Promise<boolean>;
}
