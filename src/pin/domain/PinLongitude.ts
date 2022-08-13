import _ from 'lodash';

import { ValueObject } from '../../common/domain/ValueObject';
import { Result } from '../../common/presentationals/Result';

export interface PinLongitudeProps {
    value: string;
}

export const PIN_LONGITUDE_SHOULD_NOT_BE_EMPTY = 'Pin longitude should not be empty.';

export class PinLongitude extends ValueObject<PinLongitudeProps> {
    private constructor(props: PinLongitudeProps) {
        super(props);
    }

    static create(pinLongitudeString: string): Result<PinLongitude> {
        if (_.isEmpty(pinLongitudeString)) {
            return Result.fail(PIN_LONGITUDE_SHOULD_NOT_BE_EMPTY);
        }

        return Result.ok(new PinLongitude({ value: pinLongitudeString }));
    }

    get value(): string {
        return this.props.value;
    }
}
