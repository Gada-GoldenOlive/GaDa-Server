import { ImageUrl } from '../../common/domain/Image/ImageUrl';
import { Pin, PROPS_VALUES_ARE_REQUIRED } from './Pin';
import { PinContent } from './PinContent';
import { PinTitle } from './PinTitle';

describe('Pin', () => {
    const TEST_PIN_ID = 'test-pin-uuid';
    const pinTitle = PinTitle.create('여기에 경사가 있어요').value;
    const pinContent = PinContent.create('대충 내용').value;
    const pinImage = ImageUrl.create('test-image-url.png').value;
    const createdAt = new Date();
    const updatedAt = new Date();

    it('Pin createNew 성공', () => {
        const pinOrError = Pin.createNew({
            title: pinTitle,
            content: pinContent,
            image: pinImage,
        });
        
        expect(pinOrError.isSuccess).toBeTruthy();
        expect(pinOrError.value.id).toBeDefined();
        expect(pinOrError.value.title.value).toBe(pinTitle.value);
        expect(pinOrError.value.content.value).toBe(pinContent.value);
        expect(pinOrError.value.image.value).toBe(pinImage.value);
    });

    it('Pin create 성공', () => {
        const pinOrError = Pin.create({
            title: pinTitle,
            content: pinContent,
            image: pinImage,
            createdAt,
            updatedAt,
        }, TEST_PIN_ID);

        expect(pinOrError.isSuccess).toBeTruthy();
        expect(pinOrError.value.id).toBe(TEST_PIN_ID);
        expect(pinOrError.value.title.value).toBe(pinTitle.value);
        expect(pinOrError.value.content.value).toBe(pinContent.value);
        expect(pinOrError.value.image.value).toBe(pinImage.value);
        expect(pinOrError.value.createdAt).toBe(createdAt);
        expect(pinOrError.value.updatedAt).toBe(updatedAt);
    });

    it('pin title이 null이나 undefined로 전달될 경우 Pin createNew는 실패해야 한다.', () => {
        const pinOrErrorWithNull = Pin.createNew({
            title: null,
            content: pinContent,
            image: pinImage,
        });

        
        const pinOrErrorWithUndefined = Pin.createNew({
            title: undefined,
            content: pinContent,
            image: pinImage,
        });

        expect(pinOrErrorWithNull.isFailure).toBeTruthy();
        expect(pinOrErrorWithUndefined.isFailure).toBeTruthy();
        expect(pinOrErrorWithNull.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
        expect(pinOrErrorWithUndefined.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
    });

    it('pin content가 null이나 undefined로 전달될 경우 Pin createNew는 실패해야 한다.', () => {
        const pinOrErrorWithNull = Pin.createNew({
            title: pinTitle,
            content: null,
            image: pinImage,
        });
        
        const pinOrErrorWithUndefined = Pin.createNew({
            title: pinTitle,
            content: undefined,
            image: pinImage,
        });

        expect(pinOrErrorWithNull.isFailure).toBeTruthy();
        expect(pinOrErrorWithUndefined.isFailure).toBeTruthy();
        expect(pinOrErrorWithNull.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
        expect(pinOrErrorWithUndefined.errorValue()).toBe(PROPS_VALUES_ARE_REQUIRED);
    });
})
