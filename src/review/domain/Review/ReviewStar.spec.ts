import { MAX_STAR, MIN_STAR, ReviewStar, REVIEW_STAR_SHOULD_BE_WITHIN_RANGE } from './ReviewStar';

describe('ReviewStar', () => {
    const reviewStarNumber = 5;

    it('ReviewStar create 성공', () => {
        const reviewStarOrError = ReviewStar.create(reviewStarNumber);

        expect(reviewStarOrError.isSuccess).toBeTruthy();
        expect(reviewStarOrError.value.value).toBe(reviewStarNumber);
    });

    it('Review star는 1개에서 5개 사이여야 한다.', () => {
        const reviewStarOrErrorUnderMinimum = ReviewStar.create(MIN_STAR - 1);
        const reviewStarOrErrorOverMaximum = ReviewStar.create(MAX_STAR + 1);

        expect(reviewStarOrErrorUnderMinimum.isFailure).toBeTruthy();
        expect(reviewStarOrErrorOverMaximum.isFailure).toBeTruthy();
        expect(reviewStarOrErrorUnderMinimum.errorValue()).toBe(REVIEW_STAR_SHOULD_BE_WITHIN_RANGE);
        expect(reviewStarOrErrorOverMaximum.errorValue()).toBe(REVIEW_STAR_SHOULD_BE_WITHIN_RANGE);
    });
});
