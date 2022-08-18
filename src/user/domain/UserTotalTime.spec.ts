import { UserTotalTime, USER_TOTAL_TIME_CANNOT_BE_NEGATIVE } from './UserTotalTime';

describe('UserTotalTime', () => {
    const startUserTotalTimeNumber = 0;

    it('UserTotalTime create 성공', () => {
        const UserTotalTimeOrError = UserTotalTime.create(startUserTotalTimeNumber);

        expect(UserTotalTimeOrError.isSuccess).toBeTruthy();
        expect(UserTotalTimeOrError.value.value).toBe(startUserTotalTimeNumber);
    });

    it('사용자가 달린 총 시간(total time)는 음수일 수 없다.', () => {
        const UserTotalTimeWithNegative = -1;

        const UserTotalTimeOrErrorWithNegative = UserTotalTime.create(UserTotalTimeWithNegative);

        expect(UserTotalTimeOrErrorWithNegative.isFailure).toBeTruthy();
        expect(UserTotalTimeOrErrorWithNegative.errorValue()).toBe(USER_TOTAL_TIME_CANNOT_BE_NEGATIVE);
    });
});
