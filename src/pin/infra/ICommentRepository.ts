import { Comment } from "../domain/Comment/Comment";

export const COMMENT_REPOSITORY = Symbol('COMMENT_REPOSITORY');

export interface ICommentRepository {
    save(comment: Comment): Promise<boolean>;
}
