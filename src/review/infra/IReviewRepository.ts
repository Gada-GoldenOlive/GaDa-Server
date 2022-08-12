import { Review } from '../domain/Review/Review';
import { GetAllReviewOptions } from './mysql/MysqlReviewRepository';

export const REVIEW_REPOSITORY = Symbol('REVIEW_REPOSITORY');

export interface IReviewRepository {
    getOne(id: string): Promise<Review>;
    save(review: Review): Promise<boolean>;
    getAll(options: GetAllReviewOptions): Promise<Review[]>;
}