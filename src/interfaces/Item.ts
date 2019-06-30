'use strict'

/**
 * Defines the structure for an item saved to the storage.
 * 
 * @since 2.0.0
 */
export default interface Item {

  // The primitive or complex data type of the item.
  type: string;

  // The timestamp of the when this item was saved.
  timestamp: number;

  // The timestamp of when this item expires.
  expires: number;

  // The data associated with this item.
  data: any;

}