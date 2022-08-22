import { ImageUrl } from './ImageUrl';

describe('Product, Company Image Domain', () => {
	const TEST_IMAGE_URL = 'test-image-url.png';

	it('Create 성공', () => {
		const thumbnailOrError = ImageUrl.create(TEST_IMAGE_URL);

		expect(thumbnailOrError.isSuccess).toBeTruthy();
		expect(thumbnailOrError.value.value).toBe(TEST_IMAGE_URL);
	});
	
	//TODO: domain 수정할 경우 test code 수정도 필요해 보임..!!
});
