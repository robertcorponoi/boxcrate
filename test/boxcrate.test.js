'use strict'

import { BoxCrate } from '../boxcrate.js';

// TEST: 
// Browser's localStorage connects to BoxCrate.
describe('Initializing the storage', () => {

  let boxcrate;

  beforeEach(() => {

    window.localStorage.clear();

  });

  afterEach(() => {

    boxcrate = null;

  });

  // It should property use the browser's localStorage as it is available.
  it('should set the storage property equal to window.localStorage', () => {

    boxcrate = new BoxCrate();

    chai.expect(boxcrate.storage.length).to.equal(0);

  });

});

// TEST:
// Primitive types are can get and gotten in their original forms.
describe('Setting and getting items from the storage', () => {

  let boxcrate;

  beforeEach(() => {

    window.localStorage.clear();

    boxcrate = new BoxCrate();

  });

  afterEach(() => {

    boxcrate = null;

  });

  // Strings should be retrieved as strings.
  it('should set and get a string', () => {

    const str = 'Hello World!';

    boxcrate.setItem('test', str);

    let value = boxcrate.getItem('test');

    chai.expect(value).to.equal('Hello World!') && chai.expect(typeof (value)).to.equal('string');

  });

  // Numbers should be retrieved as numbers.
  it('should set and get a number', () => {

    const num = 5;

    boxcrate.setItem('test', num);

    let value = boxcrate.getItem('test');

    chai.expect(value).to.equal(5) && chai.expect(typeof (value)).to.equal('number');

  });

  // Booleans should be retrieved as booleans.
  it('should set and get a boolean', () => {

    const bool = true;

    boxcrate.setItem('test', bool);

    let value = boxcrate.getItem('test');

    chai.expect(value).to.equal(true) && chai.expect(typeof (value)).to.equal('boolean');

  });

  // Undefined should be retrieved as undefined.
  it('should set and get an undefined value', () => {

    const undef = undefined;

    boxcrate.setItem('test', undef);

    let value = boxcrate.getItem('test');

    chai.expect(value).to.equal(undefined) && chai.expect(typeof (value)).to.equal('undefined');

  });

  // Null should be retrieved as null.
  it('should set and get a null value', () => {

    const nul = null;

    boxcrate.setItem('test', nul);

    let value = boxcrate.getItem('test');

    chai.expect(value).to.equal(null) && chai.expect(typeof (value)).to.equal('object');

  });

  // Arrays should be retrieved as arrays.
  it('should set and get an array', () => {

    const arr = [1, 'Bob', 2, 'John'];

    boxcrate.setItem('test', arr);

    let value = boxcrate.getItem('test');

    chai.expect(value).to.deep.equal([1, 'Bob', 2, 'John']) && chai.expect(typeof (value)).to.equal('object');

  });

  it('should set and get an array with an object in it', () => {

    const arr = [1, 'Bob', 2, 'John', { food: 'pizza', toppings: ['Pepperoni', 'Cheese', 'Peppers'] }];

    boxcrate.setItem('test', arr);

    let value = boxcrate.getItem('test');

    chai.expect(value).to.deep.equal([1, 'Bob', 2, 'John', { food: 'pizza', toppings: ['Pepperoni', 'Cheese', 'Peppers'] }]) && chai.expect(typeof (value)).to.equal('object');

  });

  it('should set and get an array with an array in it', () => {

    const arr = [1, 'Bob', 2, 'John', ['Pepperoni', 'Cheese', 'Peppers']];

    boxcrate.setItem('test', arr);

    let value = boxcrate.getItem('test');

    chai.expect(value).to.deep.equal([1, 'Bob', 2, 'John', ['Pepperoni', 'Cheese', 'Peppers']]) && chai.expect(typeof (value)).to.equal('object');

  });

  // Objects should be retrieved as objects.
  it('should set and get a simple object', () => {

    const obj = {
      hello: 'world',
      age: 25,
      favorite: {
        games: ['Stardew Valley', 'Tomb Raider', 'Rocket League']
      }
    };

    boxcrate.setItem('test', obj);

    let value = boxcrate.getItem('test');

    chai.expect(value).to.deep.equal(obj) && chai.expect(typeof (value)).to.equal('object');

  });

});

// TEST:
// Data expires onGet, passively, actively, and on a custom timer.
describe('Data expiring in the storage', () => {

  let boxcrate;
  let clock;

  beforeEach(() => {

    window.localStorage.clear();

    clock = sinon.useFakeTimers();

  });

  afterEach(() => {

    boxcrate = null;

    clock.restore();

  });

  // Item should expire using the 'onGet' method.
  it('should remove the item from storage when retrieved because the time is expired using the onGet method', () => {

    boxcrate = new BoxCrate({ expiredCheckType: 'onGet' });

    const str = 'Hello World!';

    boxcrate.setItem('test', str, 4000);

    clock.tick(8000);

    let value = boxcrate.getItem('test');

    chai.expect(value).to.equal(undefined);

  });

  // Item should expire using the 'passive' method.
  it('should remove the item from storage when retrieved because the time is expired using the passive method', () => {

    boxcrate = new BoxCrate({ expiredCheckType: 'passive' });

    const str = 'Hello World!';

    boxcrate.setItem('test', str, 5000);

    clock.tick(60000);

    let value = boxcrate.getItem('test');

    chai.expect(value).to.equal(undefined);

  });

});

// TEST:
// Items are removed from storage on request.
describe('Removing items from the storage', () => {

  let boxcrate;

  beforeEach(() => {

    window.localStorage.clear();

  });

  afterEach(() => {

    boxcrate = null;

  });

  // Add and remove an item from the storage.
  it('should remove the item from storage when retrieved because the time is expired using the onGet method', () => {

    boxcrate = new BoxCrate();

    const str = 'Hello World!';

    boxcrate.setItem('test', str);

    boxcrate.removeItem('test');

    const value = boxcrate.getItem('test');

    chai.expect(value).to.equal(undefined) && chai.expect(boxcrate.count).to.equal(0);

  });

});

// TEST:
// Clearing all items from the storage.
describe('Clearing all items in the storage', () => {

  let boxcrate;

  beforeEach(() => {

    window.localStorage.clear();

  });

  afterEach(() => {

    boxcrate = null;

  });

  // Adding items should add to the length.
  it('should remove the item from storage when retrieved because the time is expired using the onGet method', () => {

    boxcrate = new BoxCrate();

    const str = 'Hello World!';
    const str2 = 'Hello World!';
    const str3 = 'Hello World!';
    const str4 = 'Hello World!';
    const str5 = 'Hello World!';

    boxcrate.setItem('1', str).setItem('2', str2).setItem('3', str3).setItem('4', str4).setItem('5', str5);

    boxcrate.clear();

    chai.expect(boxcrate.count).to.equal(0) && chai.expect(boxcrate.storage.length).to.equal(0);

  });

});

// TEST:
// Storage size goes up and down depending on items being added/removed.
describe('The storage length should reflect the current items in there', () => {

  let boxcrate;
  let clock;

  beforeEach(() => {

    window.localStorage.clear();

    clock = sinon.useFakeTimers();

  });

  afterEach(() => {

    boxcrate.clear();

    boxcrate = null;

    clock.restore();

  });

  // Adding items should add to the length.
  it('should remove the item from storage when retrieved because the time is expired using the onGet method', () => {

    boxcrate = new BoxCrate({ expiredCheckType: 'passive' });

    const str = 'Hello World!';
    const str2 = 'Hello World!';
    const str3 = 'Hello World!';
    const str4 = 'Hello World!';
    const str5 = 'Hello World!';

    boxcrate.setItem('test', str, 4000).setItem('test2', str2, 4000).setItem('test3', str3, 4000).setItem('test4', str4, 4000).setItem('test5', str5, 4000);

    chai.expect(boxcrate.count).to.equal(5);

  });

  // Item should expire using the 'onGet' method.
  it('should remove the item from storage when retrieved because the time is expired using the active method', () => {

    boxcrate = new BoxCrate({ expiredCheckType: 'active' });

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