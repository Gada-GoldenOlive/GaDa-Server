import { UserPinCount, USER_PIN_COUNT_CANNOT_BE_NEGATIVE } from './UserPinCount'

describe('UserPinCount', () => {
    const defaultUserPinCountNumber = 0;
    it('UserPinCount create 성공', () => {
        const userPinCountOrError = UserPinCount.create(defaultUserPinCountNumber);

        expect(userPinCountOrError.isSuccess).toBeTruthy();
        expect(userPinCountOrError.value.value).toBe(defaultUserPinCountNumber);
    });

    it('사용자의 핀 개수(PinCount)는 음수일 수 없다.', () => {
        const userPinCountWithNegative = -1;

        const userPinCountOrErrorWithNegative = UserPinCount.create(userPinCountWithNegative);

        expect(userPinCountOrErrorWithNegative.isFailure).toBeTruthy();
        expect(userPinCountOrErrorWithNegative.errorValue()).toBe(USER_PIN_COUNT_CANNOT_BE_NEGATIVE);
    });
})