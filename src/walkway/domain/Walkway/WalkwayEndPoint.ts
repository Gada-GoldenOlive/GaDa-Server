import _ from 'lodash';

import { ValueObject } from '../../../common/domain/ValueObject';
import { Result } from '../../../common/presentationals/Result';

export interface Point {
    lat: number;
    lng: number;
}

interface WalkwayEndPointProps {
    value: Point;
}

export const WALKWAY_ENDPOINT_SHOULD_NOT_BE_EMPTY = 'Walkway endoint should not be empty.';

export class WalkwayEndPoint extends ValueObject<WalkwayEndPointProps> {
    private constructor(props: WalkwayEndPointProps) {
        super(props);
    }

    static create(walkwayEndPoint: Point): Result<WalkwayEndPoint> {
        if (_.isEmpty(walkwayEndPoint)) {
            return Result.fail(WALKWAY_ENDPOINT_SHOULD_NOT_BE_EMPTY);
        }

        return Result.ok(new WalkwayEndPoint({ value: walkwayEndPoint }));
    }

    get value(): Point {
        return this.props.value;
    }
}
