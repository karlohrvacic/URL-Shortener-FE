import { GetActiveElementsForApiKeyPipe } from './get-active-elements.pipe';

describe('GetActiveElementsPipe', () => {
  it('create an instance', () => {
    const pipe = new GetActiveElementsForApiKeyPipe();
    expect(pipe).toBeTruthy();
  });
});
