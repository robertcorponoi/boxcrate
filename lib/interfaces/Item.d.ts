/**
 * Defines the structure for an item saved to the storage.
 *
 * @since 2.0.0
 */
export default interface Item {
    type: string;
    timestamp: number;
    expires: number;
    data: any;
}
