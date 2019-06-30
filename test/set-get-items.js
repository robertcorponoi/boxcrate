'use strict'

import BoxCrate from '../boxcrate.js';

let boxcrate;

describe('Setting and getting items', () => {

  beforeEach(() => {

    window.localStorage.clear();

    boxcrate = new BoxCrate();

  });

  afterEach(() => boxcrate = null);

  it('should set and get a string item', () => {

    boxcrate.setItem('test', 'Hello World!');

    const item = boxcrate.getItem('test');

    chai.expect(item).to.equal('Hello World!') && chai.expect(typeof (item)).to.equal('string');

  });

  it('should set and get a number item', () => {

    boxcrate.setItem('test', 5);

    const item = boxcrate.getItem('test');

    chai.expect(item).to.equal(5) && chai.expect(typeof (item)).to.equal('number');

  });

  it('should set and get a boolean item', () => {

    boxcrate.setItem('test', false);

    const item = boxcrate.getItem('test');

    chai.expect(item).to.equal(false) && chai.expect(typeof (item)).to.equal('boolean');

  });

  it('should set and get an undefined item', () => {

    boxcrate.setItem('test', undefined);

    const item = boxcrate.getItem('test');

    chai.expect(item).to.equal(undefined) && chai.expect(typeof (item)).to.equal('undefined');

  });

  it('should set and get a null item', () => {

    boxcrate.setItem('test', null);

    const item = boxcrate.getItem('test');

    chai.expect(item).to.equal(null) && chai.expect(typeof (item)).to.equal('object');

  });

  it('should set and get an array item', () => {

    boxcrate.setItem('test', [1, 'Bob', 2, 'John']);

    const item = boxcrate.getItem('test');

    chai.expect(item).to.deep.equal([1, 'Bob', 2, 'John']) && chai.expect(typeof (item)).to.equal('object');

  });

  it('should set and get an array item with an object in it', () => {

    const arr = [1, 'Bob', 2, 'John', { food: 'pizza', toppings: ['Pepperoni', 'Cheese', 'Peppers'] }];

    boxcrate.setItem('test', arr);

    const value = boxcrate.getItem('test');

    chai.expect(value).to.deep.equal([1, 'Bob', 2, 'John', { food: 'pizza', toppings: ['Pepperoni', 'Cheese', 'Peppers'] }]) && chai.expect(typeof (value)).to.equal('object');

  });

  it('should set and get an array with an array in it', () => {

    const arr = [1, 'Bob', 2, 'John', ['Pepperoni', 'Cheese', 'Peppers']];

    boxcrate.setItem('test', arr);

    const value = boxcrate.getItem('test');

    chai.expect(value).to.deep.equal([1, 'Bob', 2, 'John', ['Pepperoni', 'Cheese', 'Peppers']]) && chai.expect(typeof (value)).to.equal('object');

  });

  it('should set and get a simple object', () => {

    const obj = {
      hello: 'world',
      age: 25,
      favorite: {
        games: ['Stardew Valley', 'Tomb Raider', 'Rocket League']
      }
    };

    boxcrate.setItem('test', obj);

    const value = boxcrate.getItem('test');

    chai.expect(value).to.deep.equal(obj) && chai.expect(typeof (value)).to.equal('object');

  });


});