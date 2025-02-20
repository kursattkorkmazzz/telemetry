/**
 * A generic storage class that provides methods to add, remove, and retrieve items.
 *
 * @template T - The type of items to be stored.
 */
export default class Storage<T> {
    protected _storage: Array<T>;
    /**
     * Adds an item to the storage.
     *
     * @param item - The item to be added.
     * @throws {Error} If the item already exists in the storage.
     */
    add(item: T | T[]): void;
    /**
     * Removes the specified item from the storage.
     *
     * @param item - The item to be removed from the storage.
     * @throws {Error} If the item is not found in the storage.
     */
    remove(item: T): void;
    /**
     * Removes an item from the storage at the specified index.
     *
     * @param index - The index of the item to be removed.
     */
    removeByIndex(index: number): void;
    /**
     * Removes all items from the storage.
     *
     * @remarks
     * This method clears the entire storage by setting it to an empty array.
     */
    removeAll(): void;
    /**
     * Retrieves all items from the storage.
     *
     * @returns {Array<T>} An array containing all items in the storage.
     */
    getItems(): Array<T>;
    /**
     * Iterates over each item in the storage and executes the provided callback function.
     *
     * @param callback - A function that will be called for each item in the storage.
     *                    The function receives the item and its index as arguments.
     */
    forEach(callback: (item: T, index: number) => void): void;
    /**
     * Finds the index of the specified item in the storage.
     *
     * @param item - The item to find the index of.
     * @returns The index of the item if found, otherwise -1.
     */
    protected findIndexByItem(item: T): number;
    /**
     * Checks if the given item exists in the storage.
     *
     * @param item - The item to check for existence.
     * @returns `true` if the item exists, otherwise `false`.
     */
    protected isExist(item: T): boolean;
}
