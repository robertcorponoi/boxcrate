'use strict'

import BoxCrate from '../boxcrate.js';

let clock;
let boxcrate;

describe('Data Expiration', () => {
  beforeEach(() => {
    window.localStorage.clear();

    boxcrate = new BoxCrate();

    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    boxcrate = null;

    clock.restore();
  });

  it('should remove the expired item from storage when retrieved using passive checking', () => {
    boxcrate.setItem('test', 'Hello World!', 4000);

    clock.tick(8000);

    const value = boxcrate.getItem('test');

    chai.expect(value).to.equal(undefined);
  });

  it('should remove the item from storage when retrieved because the time is expired using the active method', () => {
    boxcrate = new BoxCrate({ expiredCheckType: 'active', expiredCheckInterval: 1000 });

    const str = 'Hello World!';
    const str2 = 'Hello World!';
    const str3 = 'Hello World!';
    const str4 = 'Hello World!';
    const str5 = 'Hello World!';

    boxcrate.setItem('test', str, 4000).setItem('test2', str2, 5000).setItem('test3', str3, 6000).setItem('test4', str4, 7000).setItem('test5', str5, 10000);

    clock.tick(8000);

    chai.expect(boxcrate.count).to.equal(1);
  });
});