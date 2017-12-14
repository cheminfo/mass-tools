import loadKnapSack from '../loadKnapSack';

describe('test loadKnapSack', () => {
    it('should return 42', async () => {
        let data = await loadKnapSack();

        console.log(data);


        // expect(myModule()).toEqual(42);
    });
});
