import { LineString } from 'geojson';
import _ from 'lodash';

import { ValueObject } from '../../../common/domain/ValueObject';
import { Result } from '../../../common/presentationals/Result';

interface WalkwaypathProps {
    value: LineString;
}

export const WALKWAY_PATH_SHOULD_NOT_BE_EMPTY = 'Walkway path should not be empty.';

export class WalkwayPath extends ValueObject<WalkwaypathProps> {
    private constructor(props: WalkwaypathProps) {
        super(props);
    }

    static create(walkwayPathLineString: LineString): Result<WalkwayPath> {
        if (_.isNil(walkwayPathLineString) || _.isEmpty(walkwayPathLineString.coordinates)) {
            return Result.fail(WALKWAY_PATH_SHOULD_NOT_BE_EMPTY);
        }

        return Result.ok(new WalkwayPath({ value: walkwayPathLineString }));
    }

    get value(): LineString {
        return this.props.value;
    }
}