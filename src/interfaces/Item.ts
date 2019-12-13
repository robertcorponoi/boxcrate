'use strict'

/**
 * Defines the structure for an item saved to the storage.
 */
export default interface Item {
  type: string;
  timestamp: number;
  expires: number;
  data: any;
}