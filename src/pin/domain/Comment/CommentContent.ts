import _ from 'lodash';

import { ValueObject } from '../../../common/domain/ValueObject';
import { Result } from '../../../common/presentationals/Result';

export interface CommentContentProps {
    value: string;
}

export const COMMENT_CONTENT_SHOULD_NOT_BE_EMPTY = 'Comment content should not be empty.';

export class CommentContent extends ValueObject<CommentContentProps> {
    private constructor(props: CommentContentProps) {
        super(props);
    }

    static create(commentContentString: string): Result<CommentContent> {
        if (_.isEmpty(commentContentString)) {
            return Result.fail(COMMENT_CONTENT_SHOULD_NOT_BE_EMPTY);
        }

        return Result.ok(new CommentContent({ value: commentContentString }));
    }

    get value(): string {
        return this.props.value;
    }
}
