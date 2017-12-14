import loadGoogleSheet from '../loadGoogleSheet';

describe('test loadKnapSack', () => {
    it('should return 42', async () => {
        let data = await loadGoogleSheet();

        console.log(data);


        // expect(myModule()).toEqual(42);
    });
});
