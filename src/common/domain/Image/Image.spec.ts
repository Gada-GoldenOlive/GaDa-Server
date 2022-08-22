import { Image, PROPS_VALUES_ARE_REQUIRED } from './Image';
import { ImageUrl } from './ImageUrl';

describe('DetailImage Domain', () => {
	const TEST_ID = 'test-uuid';
	const imageUrl = ImageUrl.create('test-image-url.png').value;
	const createdAt = new Date();
	const updatedAt = new Date();

	it('Image CreateNew 성공', () => {
		const imageOrError = Image.createNew({
			url: imageUrl,
		});

		expect(imageOrError.isSuccess).toBeTruthy();
		expect(imageOrError.value.url.value).toBe(imageUrl.value);
	});

	it('Image Create 성공', () => {
		const imageOrError = Image.create({
			url: imageUrl,
			createdAt,
			updatedAt,
		}, TEST_ID);

		expect(imageOrError.isSuccess).toBeTruthy();
		expect(imageOrError.value.id).toBe(TEST_ID);
		expect(imageOrError.value.url.value).toBe(imageUrl.value);
		expect(imageOrError.value.createdAt).toBe(createdAt);
		expect(imageOrError.value.updatedAt).toBe(updatedAt);
	});

	it('url이 null이나 undefined로 들어온다면 create은 실패해야 한다.', () => {
		const imageOrErrorWithNull = Image.createNew({
			url: null,
		});

		const imageOrErrorWithUndefined = Image.createNew({
			url: undefined,
		});

		expect(imageOrErrorWithNull.isSuccess).toBeFalsy();
		expect(imageOrErrorWithUndefined.isSuccess).toBeFalsy();
		expect(imageOrErrorWithNull.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
		expect(imageOrErrorWithUndefined.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
	});
});
