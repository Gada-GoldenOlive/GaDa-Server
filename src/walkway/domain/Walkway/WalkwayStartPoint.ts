import _ from 'lodash';

import { ValueObject } from '../../../common/domain/ValueObject';
import { Result } from '../../../common/presentationals/Result';

export interface Point {
    lat: number;
    lng: number;
}

interface WalkwayStartPointProps {
    value: Point;
}

export const WALKWAY_STARTPOINT_SHOULD_NOT_BE_EMPTY = 'Walkway startPoint should not be empty.';

export class WalkwayStartPoint extends ValueObject<WalkwayStartPointProps> {
    private constructor(props: WalkwayStartPointProps) {
        super(props);
    }

    static create(walkwayStartPoint: Point): Result<WalkwayStartPoint> {
        if (_.isEmpty(walkwayStartPoint)) {
            return Result.fail(WALKWAY_STARTPOINT_SHOULD_NOT_BE_EMPTY);
        }

        return Result.ok(new WalkwayStartPoint({ value: walkwayStartPoint }));
    }

    get value(): Point {
        return this.props.value;
    }
}
