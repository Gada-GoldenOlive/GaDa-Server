import _ from 'lodash';

import { ValueObject } from '../../../common/domain/ValueObject';
import { Result } from '../../../common/presentationals/Result';

export interface ReviewTitleProps {
    value: string;
}

export const REVIEW_TITLE_SHOULD_NOT_BE_EMPTY = 'Review title should not be empty.';

export class ReviewTitle extends ValueObject<ReviewTitleProps> {
    private constructor(props: ReviewTitleProps) {
        super(props);
    }

    static create(reviewTitleString: string): Result<ReviewTitle> {
        if (_.isEmpty(reviewTitleString) || _.isNil(reviewTitleString)) {
            return Result.fail(REVIEW_TITLE_SHOULD_NOT_BE_EMPTY);
        }

        return Result.ok(new ReviewTitle({ value: reviewTitleString }));
    }

    get value(): string {
        return this.props.value;
    }
}
