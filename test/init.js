'use strict'

import BoxCrate from '../boxcrate.js';

let boxcrate;

describe('Initialization', () => {

  beforeEach(() => {
    
    window.localStorage.clear();

    boxcrate = new BoxCrate();

  });

  afterEach(() => boxcrate = null);

  it('should get a reference to the window localstorage', () => {

    chai.expect(boxcrate.storage.length).to.equal(0);

  });

});