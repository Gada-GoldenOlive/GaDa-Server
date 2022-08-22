import { PinContent } from './PinContent';

describe('PinContent', () => {
    const pinContentString = '경사져서 올라가기 힘들었어요';

    it('PinContent create 성공', () => {
        const pinContentOrError = PinContent.create(pinContentString);

        expect(pinContentOrError.isSuccess).toBeTruthy();
        expect(pinContentOrError.value.value).toBe(pinContentString);
    });
});
