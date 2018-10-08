<h1 align="center">BoxCrate</h1>

<p align="center">A wrapper for the browser's localStorage that allows you to set and get items as they are with optional expiration times.<p>

<div align="center">
  <a href="https://badge.fury.io/js/boxcrate"><img src="https://badge.fury.io/js/boxcrate.svg" alt="npm version" height="18"></a>
  <a href="https://badge.fury.io/js/boxcrate"><img src="https://img.shields.io/badge/build-passing-brightgreen.svg" alt="build" height="18"></a>
  <a href="https://badge.fury.io/js/boxcrate"><img src="https://img.shields.io/github/issues/robertcorponoi/boxcrate.svg" alt="issues" height="18"></a>
  <a href="https://badge.fury.io/js/boxcrate"><img src="https://img.shields.io/github/license/robertcorponoi/boxcrate.svg" alt="license" height="18"></a>
</div>

## **Installation**

BoxCrate works as an ES6 module or just by script reference.

To install this module through npm, simply use the following command:

```
$ npm install --save boxcrate
```

To use it as an ES6 module you can either install it through npm or download it directly and import it as so:

```js
import { BoxCrate } from './node_modules/boxcrate/boxcrate.js';
```

Or lastly, you can just reference the script the old fashioned way from the dist folder:

```html
<script src='./node_modules/boxcrate/dist/boxcrate.min.js'>
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
| options.expiredCheckType     | string | The type of expiration check to perform.                                                                                         | null    |
| options.expiredCheckInterval | number | If you select the custom expiration check type, you can specify the interval of time in which data is checked for expired items. | 1000    |

The options for `expiredCheckType` are as follows:

1. 'onGet': With the type set to 'onGet', whenever an item is set to be retrieved from localStorage, it is checked to see if it is expired and if so deleted and never retrieved.

    * **Advantage:** Very passive type of check, minimal performance cost.

    * **Disadvantage:** The item could be expired for a long time and still be accessible directly in the localStorage through the browser if the user checks it themselves.

2. 'passive': Every 60 seconds the localStorage will be checked for expired values and if found, they will be removed.

   * **Advantage:** Passive type of check, expired values are removed quickly.

   * **Disadvantage:** Performance cost is higher because of a timer having to be run.

3. 'active': Every second the localStorage will be checked for expired values and if found, they will be removed.

   * **Advantage:** Very active type of check, expired values are removed almost instantly.

   * **Disadvantage:** Performance cost is highest.

 4. 'custom': The localStorage wil be checked every X milliseconds, as specified by you. If this option is chosen, make sure to also specify the `expireCheckTime` option.

## **Properties**

### **length**

Returns the number of items saved in BoxCrate's storage.

```js
const numItems = boxcrate.length;
```

## **API**

BoxCrate aims to replicate the API of localStorage so it feels seamless switching over.

### **setItem**

Set item lets you save an item to BoxCrate's storage using a key, value, and optional expiration time.

One of the advtanges of using BoxCrate is when saving an item to the storage, you can save it as is. Normally with localStorage you can only save strings but BoxCrate lets you save strings, numbers, arrays, and objects as they are and they will be retrieved in the same format.

The only exception to this are Symbols which cannot be saved and retrieved as is as they are unique and when retrieving it the Symbol would not be equal to the original Symbol.

| param      | type   | description                                                                              | default |
|------------|--------|------------------------------------------------------------------------------------------|---------|
| key        | string | A unique key to use for the saved item.                                                  |         |
| value      | string | The item to save.                                                                        |         |
| msToExpire | number | The time, in milliseconds, until this key value pair should be removed from the storage. |         |

```js
const pizzaToppings = ['Cheese', 'Pepperoni', 'Spinach'];

boxcrate.setItem('toppings', pizzaToppings);
```

### **getItem**

Retrieve an item from BoxCrate's storage. The item will be retrieved in the same format it was saved.

| param | type   | description                            | default |
|-------|--------|----------------------------------------|---------|
| key   | string | The key of the saved item to retrieve. |         |

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

```js
boxcrate.removeItem('toppings');
```

### **clear**

Remove all saved items from BoxCrate's storage.

```js
boxcrate.clear();
```

## **License**

MIT