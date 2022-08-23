import { Point, PinLocation, PIN_LOCATION_PROPS_SHOULD_NOT_BE_EMPTY } from './PinLocation'

describe('PinLocation', () => {
	const pinLocationPoint: Point = {
		lat: 100,
		lng: 40,
	}

	it('PinLocation create 성공', () => {
		const pinLocationOrError = PinLocation.create(pinLocationPoint);

		expect(pinLocationOrError.isSuccess).toBeTruthy();
		expect(pinLocationOrError.value.value).toBe(pinLocationPoint);
	});
});
