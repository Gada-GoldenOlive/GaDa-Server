import _ from 'lodash';

import { ValueObject } from '../../common/domain/ValueObject';
import { Result } from '../../common/presentationals/Result';

export interface PinTitleProps {
    value: string;
}

export const PIN_TITLE_SHOULD_NOT_BE_EMPTY = 'Pin title should not be empty.';

export class PinTitle extends ValueObject<PinTitleProps> {
    private constructor(props: PinTitleProps) {
        super(props);
    }

    static create(pinTitleString: string): Result<PinTitle> {
        if (_.isEmpty(pinTitleString) || _.isNil(pinTitleString)) {
            return Result.fail(PIN_TITLE_SHOULD_NOT_BE_EMPTY);
        }

        return Result.ok(new PinTitle({ value: pinTitleString }));
    }

    get value(): string {
        return this.props.value;
    }
}
