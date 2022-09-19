import { ImageUrl } from '../../../common/domain/Image/ImageUrl';
import { Badge, PROPS_VALUES_ARE_REQUIRED } from './Badge';
import { BadgeStatus } from './BadgeStatus';
import { BadgeTitle } from './BadgeTitle';

describe('Badge', () => {
	const TEST_BADGE_ID = 'test-badge-uuid';
	const badgeTitle = BadgeTitle.create('친구 20명 달성!').value;
	const badgeImage = ImageUrl.create('test-image-url.png').value;
	const createdAt = new Date();
	const updatedAt = new Date();

	it('Badge createNew 성공', () => {
		const badgeOrError = Badge.createNew({
			title: badgeTitle,
			image: badgeImage,
			status: BadgeStatus.NORMAL,
		});

		expect(badgeOrError.isSuccess).toBeTruthy();
		expect(badgeOrError.value.id).toBeDefined();
		expect(badgeOrError.value.title.value).toBe(badgeTitle.value);
		expect(badgeOrError.value.image.value).toBe(badgeImage.value);
		expect(badgeOrError.value.status).toBe(BadgeStatus.NORMAL);
	});

	it('Badge create 성공', () => {
		const badgeOrError = Badge.create({
			title: badgeTitle,
			image: badgeImage,
			status: BadgeStatus.NORMAL,
			createdAt,
			updatedAt,
		}, TEST_BADGE_ID);

		expect(badgeOrError.isSuccess).toBeTruthy();
		expect(badgeOrError.value.id).toBe(TEST_BADGE_ID);
		expect(badgeOrError.value.title.value).toBe(badgeTitle.value);
		expect(badgeOrError.value.image.value).toBe(badgeImage.value);
		expect(badgeOrError.value.status).toBe(BadgeStatus.NORMAL);
        expect(badgeOrError.value.createdAt).toBe(createdAt);
        expect(badgeOrError.value.updatedAt).toBe(updatedAt);
	});

	it('badge title이 null이나 undefined로 전달될 경우 Badge createNew는 실패해야 한다.', () => {
        const badgeOrErrorWithNull = Badge.createNew({
            title: null,
            image: badgeImage,
            status: BadgeStatus.NORMAL,
        });

        const badgeOrErrorWithUndefined = Badge.createNew({
            title: undefined,
            image: badgeImage,
            status: BadgeStatus.NORMAL,
        });

        expect(badgeOrErrorWithNull.isFailure).toBeTruthy();
        expect(badgeOrErrorWithUndefined.isFailure).toBeTruthy();
        expect(badgeOrErrorWithNull.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
        expect(badgeOrErrorWithUndefined.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
    });

    it('badge image가 null이나 undefined로 전달될 경우 Badge createNew는 실패해야 한다.', () => {
        const badgeOrErrorWithNull = Badge.createNew({
            title: badgeTitle,
            image: null,
            status: BadgeStatus.NORMAL,
        });

        const badgeOrErrorWithUndefined = Badge.createNew({
            title: badgeTitle,
            image: undefined,
            status: BadgeStatus.NORMAL,
        });

        expect(badgeOrErrorWithNull.isFailure).toBeTruthy();
        expect(badgeOrErrorWithUndefined.isFailure).toBeTruthy();
        expect(badgeOrErrorWithNull.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
        expect(badgeOrErrorWithUndefined.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
    });

	it('status가 전달되지 않은 경우에는 NORMAL로 임의 설정되어야 한다.', () => {
        const badgeStatusOrError = Badge.createNew({
            title: badgeTitle,
            image: badgeImage,
        });
        
        expect(badgeStatusOrError.isSuccess).toBeTruthy();
        expect(badgeStatusOrError.value.status).toBe(BadgeStatus.NORMAL);
    });

    it('status가 null이나 undefined로 전달되는 경우에는 NORMAL로 임의 설정되어야 한다.', () => {
        const badgeStatusOrErrorWithNull = Badge.createNew({
            title: badgeTitle,
            image: badgeImage,
            status: null,
        });

        const badgeStatusOrErrorWithUndefined = Badge.createNew({
            title: badgeTitle,
            image: badgeImage,
            status: undefined,
        });

        expect(badgeStatusOrErrorWithNull.isSuccess).toBeTruthy();
        expect(badgeStatusOrErrorWithUndefined.isSuccess).toBeTruthy();
        expect(badgeStatusOrErrorWithNull.value.status).toBe(BadgeStatus.NORMAL);
        expect(badgeStatusOrErrorWithUndefined.value.status).toBe(BadgeStatus.NORMAL);
    });
});
