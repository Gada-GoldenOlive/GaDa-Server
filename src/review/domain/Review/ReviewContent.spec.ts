import { ReviewContent } from './ReviewContent';

describe('ReviewContent', () => {
    const reviewContentString = '최고의 산책로!!! 추천합니다~~';

    it('ReviewContent create 성공', () => {
        const reviewContentOrError = ReviewContent.create(reviewContentString);

        expect(reviewContentOrError.isSuccess).toBeTruthy();
        expect(reviewContentOrError.value.value).toBe(reviewContentString);
    });
})
