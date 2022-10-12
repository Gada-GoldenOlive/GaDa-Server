import { Comment } from "../domain/Comment/Comment";
import { GetAllCommentOptions } from './mysql/MysqlCommentRepository';

export const COMMENT_REPOSITORY = Symbol('COMMENT_REPOSITORY');

export interface ICommentRepository {
    findAll(options: GetAllCommentOptions): Promise<Comment[]>;
    findOne(id: string): Promise<Comment>;
    save(comment: Comment): Promise<boolean>;
}
