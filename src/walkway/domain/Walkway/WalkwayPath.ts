import _ from 'lodash';

import { ValueObject } from '../../../common/domain/ValueObject';
import { Result } from '../../../common/presentationals/Result';

export interface Point {
    lat: number;
    lng: number;
}

interface WalkwaypathProps {
    value: Point[];
}

export const WALKWAY_PATH_SHOULD_NOT_BE_EMPTY = 'Walkway path should not be empty.';

export class WalkwayPath extends ValueObject<WalkwaypathProps> {
    private constructor(props: WalkwaypathProps) {
        super(props);
    }

    static create(walkwayPathPoint: Point[]): Result<WalkwayPath> {
        if (_.isEmpty(walkwayPathPoint)) {
            return Result.fail(WALKWAY_PATH_SHOULD_NOT_BE_EMPTY);
        }

        return Result.ok(new WalkwayPath({ value: walkwayPathPoint }));
    }

    get value(): Point[] {
        return this.props.value;
    }
}
