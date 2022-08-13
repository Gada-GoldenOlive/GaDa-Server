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
})
