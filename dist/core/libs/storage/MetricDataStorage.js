"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Storage_js_1 = __importDefault(require("./Storage.js"));
class MetricDataStorage extends Storage_js_1.default {
    constructor() {
        super();
    }
    merge() {
        return new Promise((resolve, reject) => {
            try {
                let mergedData = {};
                this._storage.forEach((item) => {
                    const { name, data, timestamp } = item;
                    // If the object not contain anything about name, initialize it.
                    if (!mergedData[name]) {
                        mergedData[name] = {
                            name: name,
                            data: [],
                            timestamp: [],
                        };
                    }
                    const isDataArray = Array.isArray(data);
                    const isTimestampArray = Array.isArray(timestamp);
                    if (isDataArray) {
                        mergedData[name].data.push(...data);
                    }
                    else {
                        mergedData[name].data.push(data);
                    }
                    if (isTimestampArray) {
                        if (!isDataArray || data.length < timestamp.length) {
                            mergedData[name].timestamp.push(timestamp[0]);
                            return;
                        }
                        mergedData[name].timestamp.push(...timestamp);
                    }
                    else {
                        if (isDataArray) {
                            const pump = new Array(data.length).fill(timestamp);
                            mergedData[name].timestamp.push(...pump);
                            return;
                        }
                        mergedData[name].timestamp.push(timestamp);
                    }
                });
                this.removeAll();
                Object.values(mergedData).forEach((item) => {
                    this.add(item);
                });
                resolve();
            }
            catch (e) {
                reject(e);
            }
        });
    }
}
exports.default = MetricDataStorage;
