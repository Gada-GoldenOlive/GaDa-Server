import { PROPS_VALUES_ARE_REQUIRED } from '../../../common/domain/Image/Image';
import { ImageUrl } from '../../../common/domain/Image/ImageUrl';
import { User } from '../../../user/domain/User/User';
import { UserName } from '../../../user/domain/User/UserName';
import { UserStatus } from '../../../user/domain/User/UserStatus';
import { UserTotalDistance } from '../../../user/domain/User/UserTotalDistance';
import { UserTotalTime } from '../../../user/domain/User/UserTotalTime';
import { Walkway } from '../../../walkway/domain/Walkway/Walkway';
import { WalkwayAddress } from '../../../walkway/domain/Walkway/WalkwayAddress';
import { WalkwayDistance } from '../../../walkway/domain/Walkway/WalkwayDistance';
import { WalkwayPath } from '../../../walkway/domain/Walkway/WalkwayPath';
import { WalkwayStartPoint } from '../../../walkway/domain/Walkway/WalkwayStartPoint';
import { WalkwayStatus } from '../../../walkway/domain/Walkway/WalkwayStatus';
import { WalkwayTime } from '../../../walkway/domain/Walkway/WalkwayTime';
import { WalkwayTitle } from '../../../walkway/domain/Walkway/WalkwayTitle';
import { Review } from './Review';
import { ReviewContent } from './ReviewContent';
import { ReviewStar } from './ReviewStar';
import { ReviewStatus } from './ReviewStatus';
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
    const TEST_WALKWAY_ID = 'test-walkway-uuid';
    const walkwayTitle = WalkwayTitle.create('산책로 이름').value;
    const walkwayAddress = WalkwayAddress.create('산책로 주소').value
    const walkwayDistance = WalkwayDistance.create(25).value;
    const walkwayTime = WalkwayTime.create(30).value;
    const walkwayPath = WalkwayPath.create([
        {lat: 100, lng: 40}, 
        {lat: 100, lng: 40},
    ]).value;
    const walkwayStartPoint = WalkwayStartPoint.create({
        lat: 100,
        lng: 40
    }).value;
    const walkway = Walkway.create({
        title: walkwayTitle,
        address: walkwayAddress,
        distance: walkwayDistance,
        time: walkwayTime,
        path: walkwayPath,
        status: WalkwayStatus.NORMAL,
        startPoint: walkwayStartPoint,
        createdAt,
        updatedAt,
    }, TEST_WALKWAY_ID).value;
    const TEST_USER_ID = 'test-user-uuid';
    const userName = UserName.create('유저이름').value;
    const userImage = ImageUrl.create('user-image-test.png').value;
    const userTotalDistance = UserTotalDistance.create(20).value;
    const userTotalTime = UserTotalTime.create(1123).value;
    const user = User.create({
        name: userName,
        image: userImage,
        totalDistance: userTotalDistance,
        totalTime: userTotalTime,
        status: UserStatus.NORMAL,
        createdAt,
        updatedAt,
    }, TEST_USER_ID).value;


    it('Review createNew 성공', () => {
        const reviewOrError = Review.createNew({
            title: reviewTitle,
            vehicle: Vehicle.AUTO,
            star: reviewStar,
            content: reviewContent,
            image: reviewImage,
            status: ReviewStatus.NORMAL,
            walkway,
            user,
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
            status: ReviewStatus.NORMAL,
            walkway,
            user,
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
            status: ReviewStatus.NORMAL,
            walkway,
            user,
        });
        
        const reviewOrErrorWithUndefined = Review.createNew({
            title: undefined,
            vehicle: Vehicle.AUTO,
            star: reviewStar,
            content: reviewContent,
            image: reviewImage,
            status: ReviewStatus.NORMAL,
            walkway,
            user,
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
            status: ReviewStatus.NORMAL,
            walkway,
            user,
        });
        
        const reviewOrErrorWithUndefined = Review.createNew({
            title: reviewTitle,
            vehicle: undefined,
            star: reviewStar,
            content: reviewContent,
            image: reviewImage,
            status: ReviewStatus.NORMAL,
            walkway,
            user,
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
            status: ReviewStatus.NORMAL,
            walkway,
            user,
        });
        
        const reviewOrErrorWithUndefined = Review.createNew({
            title: reviewTitle,
            vehicle: Vehicle.AUTO,
            star: undefined,
            content: reviewContent,
            image: reviewImage,
            status: ReviewStatus.NORMAL,
            walkway,
            user,
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
            status: ReviewStatus.NORMAL,
            walkway,
            user,
        });
        
        const reviewOrErrorWithUndefined = Review.createNew({
            title: reviewTitle,
            vehicle: Vehicle.AUTO,
            star: reviewStar,
            content: undefined,
            image: reviewImage,
            status: ReviewStatus.NORMAL,
            walkway,
            user,
        });

        expect(reviewOrErrorWithNull.isFailure).toBeTruthy();
        expect(reviewOrErrorWithUndefined.isFailure).toBeTruthy();
        expect(reviewOrErrorWithNull.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
        expect(reviewOrErrorWithUndefined.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
    });

    it('walkway가 null이나 undefined로 전달될 경우 Review createNew는 실패해야 한다.', () => {
        const reviewOrErrorWithNull = Review.createNew({
            title: reviewTitle,
            vehicle: Vehicle.AUTO,
            star: reviewStar,
            content: reviewContent,
            image: reviewImage,
            status: ReviewStatus.NORMAL,
            walkway: null,
            user,
        });
        
        const reviewOrErrorWithUndefined = Review.createNew({
            title: reviewTitle,
            vehicle: Vehicle.AUTO,
            star: reviewStar,
            content: reviewContent,
            image: reviewImage,
            status: ReviewStatus.NORMAL,
            walkway: undefined,
            user,
        });

        expect(reviewOrErrorWithNull.isFailure).toBeTruthy();
        expect(reviewOrErrorWithUndefined.isFailure).toBeTruthy();
        expect(reviewOrErrorWithNull.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
        expect(reviewOrErrorWithUndefined.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
    });

    it('user가 null이나 undefined로 전달될 경우 Review createNew는 실패해야 한다.', () => {
        const reviewOrErrorWithNull = Review.createNew({
            title: reviewTitle,
            vehicle: Vehicle.AUTO,
            star: reviewStar,
            content: reviewContent,
            image: reviewImage,
            status: ReviewStatus.NORMAL,
            walkway,
            user: null,
        });
        
        const reviewOrErrorWithUndefined = Review.createNew({
            title: reviewTitle,
            vehicle: Vehicle.AUTO,
            star: reviewStar,
            content: reviewContent,
            image: reviewImage,
            status: ReviewStatus.NORMAL,
            walkway,
            user: undefined,
        });

        expect(reviewOrErrorWithNull.isFailure).toBeTruthy();
        expect(reviewOrErrorWithUndefined.isFailure).toBeTruthy();
        expect(reviewOrErrorWithNull.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
        expect(reviewOrErrorWithUndefined.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
    });

    it('status가 전달되지 않은 경우에는 NORMAL로 임의 설정되어야 한다.', () => {
        const reviewStatusOrError = Review.createNew({
            title: reviewTitle,
            vehicle: Vehicle.AUTO,
            star: reviewStar,
            content: reviewContent,
            image: reviewImage,
            walkway,
            user: undefined,
        });
        
        expect(reviewStatusOrError.isSuccess).toBeTruthy();
        expect(reviewStatusOrError.value.status).toBe(ReviewStatus.NORMAL);
    });

    it('status가 null이나 undefined로 전달되는 경우에는 NORMAL로 임의 설정되어야 한다.', () => {
        const reviewStatusOrErrorWithNull = Review.createNew({
            title: reviewTitle,
            vehicle: Vehicle.AUTO,
            star: reviewStar,
            content: reviewContent,
            image: reviewImage,
            status: null,
            walkway,
            user: undefined,
        });

        const reviewStatusOrErrorWithUndefined = Review.createNew({
            title: reviewTitle,
            vehicle: Vehicle.AUTO,
            star: reviewStar,
            content: reviewContent,
            image: reviewImage,
            status: undefined,
            walkway,
            user: undefined,
        });

        expect(reviewStatusOrErrorWithNull.isSuccess).toBeTruthy();
        expect(reviewStatusOrErrorWithUndefined.isSuccess).toBeTruthy();
        expect(reviewStatusOrErrorWithNull.value.status).toBe(ReviewStatus.NORMAL);
        expect(reviewStatusOrErrorWithUndefined.value.status).toBe(ReviewStatus.NORMAL);
    });
})
