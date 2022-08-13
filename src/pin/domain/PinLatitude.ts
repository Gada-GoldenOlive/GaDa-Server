import _ from 'lodash';

import { ValueObject } from '../../common/domain/ValueObject';
import { Result } from '../../common/presentationals/Result';

export interface PinLatitudeProps {
    value: string;
}

export const PIN_LATITUDE_SHOULD_NOT_BE_EMPTY = 'Pin latitude should not be empty.';

export class PinLatitude extends ValueObject<PinLatitudeProps> {
    private constructor(props: PinLatitudeProps) {
        super(props);
    }

    static create(pinLatitudeString: string): Result<PinLatitude> {
        if (_.isEmpty(pinLatitudeString)) {
            return Result.fail(PIN_LATITUDE_SHOULD_NOT_BE_EMPTY);
        }
        
        return Result.ok(new PinLatitude({ value: pinLatitudeString }));
    }

    get value(): string {
        return this.props.value;
    }
}
