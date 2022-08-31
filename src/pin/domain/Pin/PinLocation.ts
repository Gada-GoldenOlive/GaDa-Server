import _ from 'lodash';

import { ValueObject } from '../../../common/domain/ValueObject';
import { Result } from '../../../common/presentationals/Result';

export interface Point {
	lat: number;
	lng: number;
}

interface PinLocationProps {
	value: Point;
}

export const PIN_LOCATION_PROPS_SHOULD_NOT_BE_EMPTY = 'Pin location props should not be empty.';

export class PinLocation extends ValueObject<PinLocationProps> {
	private constructor(props: PinLocationProps) {
		super(props);
	}

	static create(pinLocation: Point): Result<PinLocation> {
		if (_.isEmpty(pinLocation)) {
			return Result.fail(PIN_LOCATION_PROPS_SHOULD_NOT_BE_EMPTY);
		}

		return Result.ok(new PinLocation({ value: pinLocation }))
	}

	get value(): Point {
		return this.props.value;
	}
}
