import { ReviewTitle, REVIEW_TITLE_SHOULD_NOT_BE_EMPTY } from './ReviewTitle';

describe('ReviewTitle', () => {
    const reviewTitleString = '산책로 리뷰입니다.';

    it('ReviewTitle create 성공', () => {
        const reviewTitleOrError = ReviewTitle.create(reviewTitleString);

        expect(reviewTitleOrError.isSuccess).toBeTruthy();
        expect(reviewTitleOrError.value.value).toBe(reviewTitleString);
    });

    it('Review title에는 빈 값이 들어갈 수 없다.', () => {
        const reviewTitleOrError = ReviewTitle.create('');

        expect(reviewTitleOrError.isFailure).toBeTruthy();
        expect(reviewTitleOrError.errorValue()).toBe(REVIEW_TITLE_SHOULD_NOT_BE_EMPTY);
    });
})
