import { PaginationResult } from "../../common/pagination/PaginationResponse";
import { Comment } from "../domain/Comment/Comment";
import { GetAllCommentOptions } from './mysql/MysqlCommentRepository';

export const COMMENT_REPOSITORY = Symbol('COMMENT_REPOSITORY');

export interface ICommentRepository {
    findAll(options: GetAllCommentOptions): Promise<PaginationResult<Comment>>;
    findOne(id: string): Promise<Comment>;
    save(comment: Comment): Promise<boolean>;
    updateAll(comments: Comment[]): Promise<boolean>;
}
