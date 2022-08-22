import _ from 'lodash';

import { ValueObject } from '../../../common/domain/ValueObject';
import { Result } from '../../../common/presentationals/Result';

export interface WalkwayTitleProps {
    value: string;
}

export const WALKWAY_TITLE_SHOULD_NOT_BE_EMPTY = 'Walkway title should not be empty.';

export class WalkwayTitle extends ValueObject<WalkwayTitleProps> {
    private constructor(props: WalkwayTitleProps) {
        super(props);
    }

    static create(walkwayTitleString: string): Result<WalkwayTitle> {
        if (_.isEmpty(walkwayTitleString)) {
            return Result.fail(WALKWAY_TITLE_SHOULD_NOT_BE_EMPTY);
        }

        return Result.ok(new WalkwayTitle({ value: walkwayTitleString }));
    }

    get value(): string {
        return this.props.value;
    }
}
