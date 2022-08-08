import { PROPS_VALUES_ARE_REQUIRED } from '../../../common/domain/Image/Image';
import { ImageUrl } from '../../../common/domain/Image/ImageUrl';
import { Review } from './Review';
import { ReviewContent } from './ReviewContent';
import { ReviewStar } from './ReviewStar';
import { ReviewTitle } from './ReviewTitle';
import { Vehicle } from './Vehicle';

describe('Review', () => {
    const TEST_REVIEW_ID = 'test-review-uuid';
    const reviewTitle = ReviewTitle.create('리뷰 제목').value;
    const reviewStar = ReviewStar.create(3).value;
    const reviewContent = ReviewContent.create('내용없음').value;
    const reviewImage = ImageUrl.create('test-image-url.png').value;
    const createdAt = new Date();
    const updatedAt = new Date();

    it('Review createNew 성공', () => {
        const reviewOrError = Review.createNew({
            title: reviewTitle,
            vehicle: Vehicle.AUTO,
            star: reviewStar,
            content: reviewContent,
            image: reviewImage,
        });

        expect(reviewOrError.isSuccess).toBeTruthy();
        expect(reviewOrError.value.id).toBeDefined();
        expect(reviewOrError.value.title.value).toBe(reviewTitle.value);
        expect(reviewOrError.value.vehicle).toBe(Vehicle.AUTO);
        expect(reviewOrError.value.content.value).toBe(reviewContent.value);
        expect(reviewOrError.value.star.value).toBe(reviewStar.value);
        expect(reviewOrError.value.image.value).toBe(reviewImage.value);
    });

    it('Review create 성공', () => {
        const reviewOrError = Review.create({
            title: reviewTitle,
            vehicle: Vehicle.AUTO,
            star: reviewStar,
            content: reviewContent,
            image: reviewImage,
            createdAt,
            updatedAt,
        }, TEST_REVIEW_ID);

        expect(reviewOrError.isSuccess).toBeTruthy();
        expect(reviewOrError.value.id).toBe(TEST_REVIEW_ID);
        expect(reviewOrError.value.title.value).toBe(reviewTitle.value);
        expect(reviewOrError.value.vehicle).toBe(Vehicle.AUTO);
        expect(reviewOrError.value.content.value).toBe(reviewContent.value);
        expect(reviewOrError.value.star.value).toBe(reviewStar.value);
        expect(reviewOrError.value.image.value).toBe(reviewImage.value);
    });

    it('Review title이 null이나 undefined로 전달될 경우 Review createNew는 실패해야 한다.', () => {
        const reviewOrErrorWithNull = Review.createNew({
            title: null,
            vehicle: Vehicle.AUTO,
            star: reviewStar,
            content: reviewContent,
            image: reviewImage,
        });
        
        const reviewOrErrorWithUndefined = Review.createNew({
            title: undefined,
            vehicle: Vehicle.AUTO,
            star: reviewStar,
            content: reviewContent,
            image: reviewImage,
        });

        expect(reviewOrErrorWithNull.isFailure).toBeTruthy();
        expect(reviewOrErrorWithUndefined.isFailure).toBeTruthy();
        expect(reviewOrErrorWithNull.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
        expect(reviewOrErrorWithUndefined.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
    });

    it('Review vehicle이 null이나 undefined로 전달될 경우 Review createNew는 실패해야 한다.', () => {
        const reviewOrErrorWithNull = Review.createNew({
            title: reviewTitle,
            vehicle: null,
            star: reviewStar,
            content: reviewContent,
            image: reviewImage,
        });
        
        const reviewOrErrorWithUndefined = Review.createNew({
            title: reviewTitle,
            vehicle: undefined,
            star: reviewStar,
            content: reviewContent,
            image: reviewImage,
        });

        expect(reviewOrErrorWithNull.isFailure).toBeTruthy();
        expect(reviewOrErrorWithUndefined.isFailure).toBeTruthy();
        expect(reviewOrErrorWithNull.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
        expect(reviewOrErrorWithUndefined.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
    });
    
    it('Review star가 null이나 undefined로 전달될 경우 Review createNew는 실패해야 한다.', () => {
        const reviewOrErrorWithNull = Review.createNew({
            title: reviewTitle,
            vehicle: Vehicle.AUTO,
            star: null,
            content: reviewContent,
            image: reviewImage,
        });
        
        const reviewOrErrorWithUndefined = Review.createNew({
            title: reviewTitle,
            vehicle: Vehicle.AUTO,
            star: undefined,
            content: reviewContent,
            image: reviewImage,
        });

        expect(reviewOrErrorWithNull.isFailure).toBeTruthy();
        expect(reviewOrErrorWithUndefined.isFailure).toBeTruthy();
        expect(reviewOrErrorWithNull.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
        expect(reviewOrErrorWithUndefined.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
    });
    
    it('Review content가 null이나 undefined로 전달될 경우 Review createNew는 실패해야 한다.', () => {
        const reviewOrErrorWithNull = Review.createNew({
            title: reviewTitle,
            vehicle: Vehicle.AUTO,
            star: reviewStar,
            content: null,
            image: reviewImage,
        });
        
        const reviewOrErrorWithUndefined = Review.createNew({
            title: reviewTitle,
            vehicle: Vehicle.AUTO,
            star: reviewStar,
            content: undefined,
            image: reviewImage,
        });

        expect(reviewOrErrorWithNull.isFailure).toBeTruthy();
        expect(reviewOrErrorWithUndefined.isFailure).toBeTruthy();
        expect(reviewOrErrorWithNull.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
        expect(reviewOrErrorWithUndefined.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
    });
})
