import { PinLatitude, PIN_LATITUDE_SHOULD_NOT_BE_EMPTY } from './PinLatitude';

describe('PinLatitude', () => {
    const companyLatitudeString = '5123.512351';

    it('PinLatitude Create 성공', () => {
        const companyLatitudeOrError = PinLatitude.create(companyLatitudeString);

        expect(companyLatitudeOrError.isSuccess).toBeTruthy();
        expect(companyLatitudeOrError.value.value).toBe(companyLatitudeString);
    });

    it('pin latitude에는 빈 값이 들어갈 수 없다.', () => {
        const pinLatitudeOrError = PinLatitude.create('');

        expect(pinLatitudeOrError.isFailure).toBeTruthy();
        expect(pinLatitudeOrError.errorValue()).toBe(PIN_LATITUDE_SHOULD_NOT_BE_EMPTY);
    });
});
