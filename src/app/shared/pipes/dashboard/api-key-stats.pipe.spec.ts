import { ApiKeyStatsPipe } from './api-key-stats.pipe';

describe('ApiKeyStatsPipe', () => {
  it('create an instance', () => {
    const pipe = new ApiKeyStatsPipe();
    expect(pipe).toBeTruthy();
  });
});
