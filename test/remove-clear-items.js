'use strict'

import BoxCrate from '../boxcrate.js';

let boxcrate;

describe('Initialization', () => {
  beforeEach(() => {
    window.localStorage.clear();

    boxcrate = new BoxCrate();
  });

  afterEach(() => boxcrate = null);

  it('should remove an item from storage', () => {
    boxcrate.setItem('test', 'Hello World!');

    boxcrate.removeItem('test');

    const item = boxcrate.getItem('test');

    chai.expect(item).to.be.undefined && chai.expect(boxcrate.storage.length).to.equal(0);
  });

  it('should remove all items from storage', () => {
    boxcrate.setItem('test', 'Hello World!');
    boxcrate.setItem('test2', 'Hello World2!');

    boxcrate.clear();

    const item = boxcrate.getItem('test');
    const item2 = boxcrate.getItem('test2');

    chai.expect(item).to.be.undefined && chai.expect(item2).to.be.undefined && chai.expect(boxcrate.storage.length).to.equal(0);
  });
});