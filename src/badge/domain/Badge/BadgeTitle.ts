import _ from 'lodash';

import { ValueObject } from '../../../common/domain/ValueObject';
import { Result } from '../../../common/presentationals/Result';

export interface BadgeTitleProps {
    value: string;
}

export const BADGE_TITLE_SHOULD_NOT_BE_EMPTY = 'Badge title should not be empty.';

export class BadgeTitle extends ValueObject<BadgeTitleProps> {
    private constructor(props: BadgeTitleProps) {
        super(props);
    }

    static create(badgeTitleString: string): Result<BadgeTitle> {
        if (_.isEmpty(badgeTitleString)) {
            return Result.fail(BADGE_TITLE_SHOULD_NOT_BE_EMPTY);
        }

        return Result.ok(new BadgeTitle({ value: badgeTitleString }));
    }

    get value(): string {
        return this.props.value;
    }
}
