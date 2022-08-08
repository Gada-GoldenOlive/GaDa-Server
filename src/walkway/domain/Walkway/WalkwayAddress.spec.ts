import { WalkwayAddress, WALKWAY_ADDRESS_SHOULD_NOT_BE_EMPTY } from './WalkwayAddress';

describe('WalkwayAddress', () => {
    const walkwayAddressString = '서울특별시 성동구 왕십리로 222';

    it('WalkwayAddress create 성공', () => {
        const walkwayAddressOrError = WalkwayAddress.create(walkwayAddressString);

        expect(walkwayAddressOrError.isSuccess).toBeTruthy();
        expect(walkwayAddressOrError.value.value).toBe(walkwayAddressString);
    });

    it('WalkwayAddress에 빈 값이 들어왔다면 create는 실패해야 한다.', () => {
        const walkwayAddressOrError = WalkwayAddress.create('');

        expect(walkwayAddressOrError.isFailure).toBeTruthy();
        expect(walkwayAddressOrError.errorValue()).toBe(WALKWAY_ADDRESS_SHOULD_NOT_BE_EMPTY);
    });
})
