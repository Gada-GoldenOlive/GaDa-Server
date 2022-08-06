import _ from 'lodash';

import { ValueObject } from '../../../common/domain/ValueObject';
import { Result } from '../../../common/presentationals/Result';

export interface WalkwayCreatorProps {
    value: string;
}

export const WALKWAY_CREATOR_SHOULD_NOT_BE_EMPTY = 'Walkway creator should not be empty.';

export class WalkwayCreator extends ValueObject<WalkwayCreatorProps> {
    private constructor(props: WalkwayCreatorProps) {
        super(props);
    }

    static create(walkwayCreatorString: string): Result<WalkwayCreator> {
        if (_.isEmpty(walkwayCreatorString) || _.isNil(walkwayCreatorString)) {
            return Result.fail(WALKWAY_CREATOR_SHOULD_NOT_BE_EMPTY);
        }

        return Result.ok(new WalkwayCreator({ value: walkwayCreatorString }));
    }

    get value(): string {
        return this.props.value;
    }
}