import { PinLongitude, PIN_LONGITUDE_SHOULD_NOT_BE_EMPTY } from './PinLongitude';

describe('PinLongitude', () => {
    const companyLongitudeString = '1234.15235';

    it('PinLongitude Create 성공', () => {
        const companyLongitudeOrError = PinLongitude.create(companyLongitudeString);

        expect(companyLongitudeOrError.isSuccess).toBeTruthy();
        expect(companyLongitudeOrError.value.value).toBe(companyLongitudeString);
    });

    it('pin longitude에는 빈 값이 들어갈 수 없다.', () => {
        const pinLongitudeOrError = PinLongitude.create('');

        expect(pinLongitudeOrError.isFailure).toBeTruthy();
        expect(pinLongitudeOrError.errorValue()).toBe(PIN_LONGITUDE_SHOULD_NOT_BE_EMPTY);
    });
});
