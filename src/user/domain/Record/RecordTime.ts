import { ValueObject } from '../../../common/domain/ValueObject';
import { Result } from '../../../common/presentationals/Result';

interface RecordTimeProps {
    value: number;
}

export const RECORD_TIME_CANNOT_BE_NEGATIVE = 'Record time cannot be negative.';

export class RecordTime extends ValueObject<RecordTimeProps> {
    private constructor(props: RecordTimeProps) {
        super(props);
    }

    static create(time: number): Result<RecordTime> {
        if (time < 0) {
            return Result.fail(RECORD_TIME_CANNOT_BE_NEGATIVE);
        }

        return Result.ok(new RecordTime({ value: time }));
    }

    get value(): number {
        return this.props.value;
    }
}
