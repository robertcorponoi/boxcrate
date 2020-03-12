<p align="center">
  <img width="250" height="250" src="https://raw.githubusercontent.com/robertcorponoi/graphics/master/boxcrate/boxcrate-logo.png">
</p>

<h1 align="center">BoxCrate</h1>

<p align="center">A smart wrapper for the browser's localStorage that allows you to set and get items as they are with optional expiration times.<p>

<div align="center">

  [![NPM version](https://img.shields.io/npm/v/boxcrate.svg?style=flat)](https://www.npmjs.com/package/boxcrate)
  [![Known Vulnerabilities](https://snyk.io/test/github/robertcorponoi/boxcrate/badge.svg)](https://snyk.io/test/github/robertcorponoi/boxcrate)
  ![npm](https://img.shields.io/npm/dt/boxcrate)
  [![NPM downloads](https://img.shields.io/npm/dm/boxcrate.svg?style=flat)](https://www.npmjs.com/package/boxcrate)
  <a href="https://badge.fury.io/js/boxcrate"><img src="https://img.shields.io/github/issues/robertcorponoi/boxcrate.svg" alt="issues" height="18"></a>
  <a href="https://badge.fury.io/js/boxcrate"><img src="https://img.shields.io/github/license/robertcorponoi/boxcrate.svg" alt="license" height="18"></a>
  [![Gitter](https://badges.gitter.im/gitterHQ/gitter.svg)](https://gitter.im/robertcorponoi)

</div>

## **Installation**

To install this module through npm, simply use the following command:

```
$ npm install --save boxcrate
```

To use it as an ES6 module you can either install it through npm or download it directly and import it as so:

```js
import BoxCrate from './node_modules/boxcrate/boxcrate.js';
```

## **Initialization**

After installing BoxCrate, a new instance can be created like so:

```js
const boxcrate = new BoxCrate();
```

There are two optional initialization options for BoxCrate which deal with the expiration of data.

If you don't specify a type of expiration check to perform, none will be u sed.

Also note that you can choose to not put an expiration date on any item you set which means it will not expire ever.

| param                        | type   | description                                                                                                                      | default |
|------------------------------|--------|----------------------------------------------------------------------------------------------------------------------------------|---------|
| options                      | Object |                                                                                                                                  |         |
| options.expiredCheckType     | string | The type of expiration check to perform. (Either 'passive' or 'active')                                                                                         | null    |
| options.expiredCheckInterval | number | If you select the passive expiration check type, you can specify the interval of time in which data is checked for expired items. | 1000    |

The options for `expiredCheckType` are as follows:

1. 'passive': With the type set to 'passive', whenever an item is set to be retrieved from localStorage, it is checked to see if it is expired and if so deleted and never retrieved.

    * **Advantage:** Very passive type of check, minimal performance cost.

    * **Disadvantage:** The item could be expired for a long time and still be accessible directly in the localStorage through the browser if the user checks it themselves.

2. 'active': Every x seconds the localStorage will be checked for expired values and if found, they will be removed.

   * **Advantage:** Very active type of check, expired values are removed almost instantly.

   * **Disadvantage:** Performance cost is highest.

## **API**

BoxCrate aims to replicate the API of localStorage so it feels seamless switching over.

### **storage**

Returns a reference to the storage. Note, this should not be modified as it will affect the original storage also.

**example:**

```js
const storage = boxcrate.storage;
```

### **count**

Returns the number of items saved in BoxCrate's storage.

**example:**

```js
const numOfItems = boxcrate.count;
```

### **setItem**

Set item lets you save an item to BoxCrate's storage using a key, value, and optional expiration time.

One of the advtanges of using BoxCrate is when saving an item to the storage, you can save it as is. Normally with localStorage you can only save strings but BoxCrate lets you save strings, numbers, arrays, and objects as they are and they will be retrieved in the same format.

The only exception to this are Symbols which cannot be saved and retrieved as is as they are unique and when retrieving it the Symbol would not be equal to the original Symbol.

| param      | type   | description                                                                              | default |
|------------|--------|------------------------------------------------------------------------------------------|---------|
| key        | string | A unique key to use for the saved item.                                                  |         |
| value      | string | The item to save.                                                                        |         |
| msToExpire | number | The time, in milliseconds, until this key value pair should be removed from the storage. |         |

**example:**

```js
const pizzaToppings = ['Cheese', 'Pepperoni', 'Spinach'];

boxcrate.setItem('toppings', pizzaToppings);
```

### **getItem**

Retrieve an item from BoxCrate's storage. The item will be retrieved in the same format it was saved.

| param | type   | description                            | default |
|-------|--------|----------------------------------------|---------|
| key   | string | The key of the saved item to retrieve. |         |

**example:**

```js
const toppings = boxcrate.getItem('toppings');

console.log(toppings);
// => ['Cheese', 'Pepperonoi', 'Spinach']
```

### **removeItem**

Remove a saved item from the storage by its key.

| param | type   | description                          | default |
|-------|--------|--------------------------------------|---------|
| key   | string | The key of the saved item to remove. |         |

**example:**

```js
boxcrate.removeItem('toppings');
```

### **clear**

Remove all saved items from BoxCrate's storage.

**example:**

```js
boxcrate.clear();
```

## **Tests**

Since BoxCrate's tests are run in the browser, you have to run:

```bash
$ npm run test
```

and then in your browser, go to `http://localhost:8888/test/index.html` to run the test suite.

## **License**

MIT