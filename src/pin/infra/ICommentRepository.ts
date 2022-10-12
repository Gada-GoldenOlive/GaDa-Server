import { Comment } from "../domain/Comment/Comment";

export const COMMENT_REPOSITORY = Symbol('COMMENT_REPOSITORY');

export interface ICommentRepository {
    findAll(pinId: string): Promise<Comment[]>;
    findOne(id: string): Promise<Comment>;
    save(comment: Comment): Promise<boolean>;
}
