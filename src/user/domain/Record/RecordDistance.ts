import { ValueObject } from '../../../common/domain/ValueObject';
import { Result } from '../../../common/presentationals/Result';

interface RecordDistanceProps {
    value: number;
}

export const RECORD_DISTANCE_CANNOT_BE_NEGATIVE = 'Record distance cannot be negative.';

export class RecordDistance extends ValueObject<RecordDistanceProps> {
    private constructor(props: RecordDistanceProps) {
        super(props);
    }

    static create(distance: number): Result<RecordDistance> {
        if (distance < 0) {
            return Result.fail(RECORD_DISTANCE_CANNOT_BE_NEGATIVE);
        }

        return Result.ok(new RecordDistance({ value: distance }));
    }

    get value(): number {
        return this.props.value;
    }
}
