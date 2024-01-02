import { MillisToMinutesSecondsPipe } from './millis-to-minutes-seconds.pipe';

describe('MillisToMinutesSecondsPipe', () => {
  it('create an instance', () => {
    const pipe = new MillisToMinutesSecondsPipe();
    expect(pipe).toBeTruthy();
  });
});
