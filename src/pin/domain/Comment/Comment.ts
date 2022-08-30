import _ from "lodash";

import { AggregateRoot } from "../../../common/domain/AggregateRoot";
import { Result } from "../../../common/presentationals/Result";
import { User } from "../../../user/domain/User/User";
import { Pin } from "../Pin/Pin";
import { CommentContent } from "./CommentContent";
import { CommentStatus, COMMENT_STATUS } from "./CommentStatus";

export interface CommentNewProps {
    content: CommentContent;
    status?: COMMENT_STATUS;
    pin: Pin;
    user: User;
}

export interface CommentProps extends CommentNewProps {
    createdAt: Date;
    updatedAt: Date;
}

export const PROPS_VALUES_ARE_REQUIRED = 'Props values are required.';

export class Comment extends AggregateRoot<CommentProps> {
    private constructor(props: CommentProps, id?: string) {
        super(props, id);
    }

    static createNew(props: CommentNewProps): Result<Comment> {
        if (_.isNil(props.content) || _.isNil(props.pin) || _.isNil(props.user)) {
            return Result.fail(PROPS_VALUES_ARE_REQUIRED);
        }

        return Result.ok(new Comment({
            ...props,
            status: this.getCommentStatusAndSetIfStatusIsUndefined(props),
            createdAt: new Date(),
            updatedAt: new Date(),
        }));
    }

    static create(props: CommentProps, id: string): Result<Comment> {
        return Result.ok(new Comment(props, id));
    }

    get content(): CommentContent {
        return this.props.content;
    }

    get status(): COMMENT_STATUS {
        return this.props.status;
    }
    
    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }

    get pin(): Pin {
        return this.props.pin;
    }

    get user(): User {
        return this.props.user;
    }

    private static getCommentStatusAndSetIfStatusIsUndefined(props: CommentNewProps) {
        let { status } = props;
        if (_.isNil(props.status) || _.isEmpty(props.status)) {
            status = CommentStatus.NORMAL;
        }
        
        return status;
    }
}
