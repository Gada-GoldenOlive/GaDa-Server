import _ from 'lodash';

import { ValueObject } from '../../../common/domain/ValueObject';
import { Result } from '../../../common/presentationals/Result';

export interface WalkwayAddressProps {
    value: string;
}

export const WALKWAY_ADDRESS_SHOULD_NOT_BE_EMPTY = 'Walkway address should not be empty.';

export class WalkwayAddress extends ValueObject<WalkwayAddressProps> {
    private constructor(props: WalkwayAddressProps) {
        super(props);
    }

    static create(walkwayAddressString: string): Result<WalkwayAddress> {
        if (_.isEmpty(walkwayAddressString)) {
            return Result.fail(WALKWAY_ADDRESS_SHOULD_NOT_BE_EMPTY);
        }

        return Result.ok(new WalkwayAddress({ value: walkwayAddressString }));
    }

    get value(): string {
        return this.props.value;
    }
}
