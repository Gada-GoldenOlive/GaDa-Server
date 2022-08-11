import _ from 'lodash';

import { ValueObject } from '../../../common/domain/ValueObject';
import { Result } from '../../../common/presentationals/Result';
import { Point } from './WalkwayStartPoint';

interface WalkwayPathProps {
    value: Point[];
}

export const WALKWAY_PATH_SHOULD_NOT_BE_EMPTY = 'Walkway path should not be empty.';

export class WalkwayPath extends ValueObject<WalkwayPathProps> {
    private constructor(props: WalkwayPathProps) {
        super(props);
    }

    static create(walkwayPathPoints: Point[]): Result<WalkwayPath> {
        if (_.isEmpty(walkwayPathPoints)) {
            return Result.fail(WALKWAY_PATH_SHOULD_NOT_BE_EMPTY);
        }

        return Result.ok(new WalkwayPath({ value: walkwayPathPoints }));
    }

    get value(): Point[] {
        return this.props.value;
    }
}
