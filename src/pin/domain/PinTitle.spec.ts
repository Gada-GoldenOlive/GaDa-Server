import { PinTitle, PIN_TITLE_SHOULD_NOT_BE_EMPTY } from './PinTitle';

describe('PinTitle', () => {
    const pinTitleString = '여기는 경사가 좀 있어요!';

    it('PinTitle create 성공', () => {
        const pinTitleOrError = PinTitle.create(pinTitleString);

        expect(pinTitleOrError.isSuccess).toBeTruthy();
        expect(pinTitleOrError.value.value).toBe(pinTitleString);
    });

    it('pin title에는 빈 값이 들어갈 수 없다.', () => {
        const pinTitleOrError = PinTitle.create('');

        expect(pinTitleOrError.isFailure).toBeTruthy();
        expect(pinTitleOrError.errorValue()).toBe(PIN_TITLE_SHOULD_NOT_BE_EMPTY);
    });

    it('Pin title에는 null값이나 undefined값이 들어갈 수 없다.', () => {
        const pinTitleOrErrorWithNull = PinTitle.create(null);
        const pinTitleOrErrorWithUndefined = PinTitle.create(undefined);

        expect(pinTitleOrErrorWithNull.isFailure).toBeTruthy();
        expect(pinTitleOrErrorWithUndefined.isFailure).toBeTruthy();
        expect(pinTitleOrErrorWithNull.errorValue()).toBe(PIN_TITLE_SHOULD_NOT_BE_EMPTY);
        expect(pinTitleOrErrorWithUndefined.errorValue()).toBe(PIN_TITLE_SHOULD_NOT_BE_EMPTY);
    });
})
