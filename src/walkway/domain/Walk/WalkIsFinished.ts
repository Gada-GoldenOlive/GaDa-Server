import { ValueObject } from "../../../common/domain/ValueObject";
import { Result } from "../../../common/presentationals/Result";

interface WalkIsFinishedProps {
    value: boolean;
}

export class WalkIsFinished extends ValueObject<WalkIsFinishedProps> {
    private constructor(props: WalkIsFinishedProps) {
        super(props);
    }

    static create(isFinished: boolean): Result<WalkIsFinished> {
        return Result.ok(new WalkIsFinished({ value: isFinished }));
    }

    get value(): boolean {
        return this.props.value;
    }
}