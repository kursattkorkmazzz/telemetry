"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorCodes_js_1 = __importDefault(require("../../../core/utils/errors/ErrorCodes.js"));
/**
 * A generic storage class that provides methods to add, remove, and retrieve items.
 *
 * @template T - The type of items to be stored.
 */
class Storage {
    _storage = [];
    /**
     * Adds an item to the storage.
     *
     * @param item - The item to be added.
     * @throws {Error} If the item already exists in the storage.
     */
    add(item) {
        const bulkItems = [];
        if (item instanceof Array) {
            bulkItems.push(...item);
        }
        else {
            bulkItems.push(item);
        }
        bulkItems.forEach((item) => {
            if (this.isExist(item)) {
                throw new Error(ErrorCodes_js_1.default.ITEM_ALREADY_EXIST);
            }
            this._storage.push(item);
        });
    }
    /**
     * Removes the specified item from the storage.
     *
     * @param item - The item to be removed from the storage.
     * @throws {Error} If the item is not found in the storage.
     */
    remove(item) {
        const index = this.findIndexByItem(item);
        if (index == -1) {
            throw new Error(ErrorCodes_js_1.default.ITEM_NOT_FOUND);
        }
        this._storage.splice(index, 1);
    }
    /**
     * Removes an item from the storage at the specified index.
     *
     * @param index - The index of the item to be removed.
     */
    removeByIndex(index) {
        this._storage.splice(index, 1);
    }
    /**
     * Removes all items from the storage.
     *
     * @remarks
     * This method clears the entire storage by setting it to an empty array.
     */
    removeAll() {
        this._storage = [];
    }
    /**
     * Retrieves all items from the storage.
     *
     * @returns {Array<T>} An array containing all items in the storage.
     */
    getItems() {
        return this._storage;
    }
    /**
     * Iterates over each item in the storage and executes the provided callback function.
     *
     * @param callback - A function that will be called for each item in the storage.
     *                    The function receives the item and its index as arguments.
     */
    forEach(callback) {
        this._storage.forEach(callback);
    }
    /**
     * Finds the index of the specified item in the storage.
     *
     * @param item - The item to find the index of.
     * @returns The index of the item if found, otherwise -1.
     */
    findIndexByItem(item) {
        return this._storage.indexOf(item);
    }
    /**
     * Checks if the given item exists in the storage.
     *
     * @param item - The item to check for existence.
     * @returns `true` if the item exists, otherwise `false`.
     */
    isExist(item) {
        return this.findIndexByItem(item) != -1;
    }
}
exports.default = Storage;
