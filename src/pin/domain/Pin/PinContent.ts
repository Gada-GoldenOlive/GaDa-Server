import { ValueObject } from '../../../common/domain/ValueObject';
import { Result } from '../../../common/presentationals/Result';

export interface PinContentProps {
    value: string;
}

export class PinContent extends ValueObject<PinContentProps> {
    private constructor(props: PinContentProps) {
        super(props);
    }

    static create(pinContentString: string): Result<PinContent> {
        return Result.ok(new PinContent({ value: pinContentString }));
    }

    get value(): string {
        return this.props.value;
    }
}
