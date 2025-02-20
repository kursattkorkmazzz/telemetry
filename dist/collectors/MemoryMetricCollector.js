"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractMetricCollector_1 = __importDefault(require("../core/abstracts/AbstractMetricCollector"));
const os_1 = __importDefault(require("os"));
class MemoryMetricCollector extends AbstractMetricCollector_1.default {
    collect() {
        const totalMemory = os_1.default.totalmem() / Math.pow(1024, 3); // Convert it from Byte to GB
        const usedMemory = (os_1.default.totalmem() - os_1.default.freemem()) / Math.pow(1024, 3); // Convert it from Byte to GB
        return new Promise((resolve, reject) => {
            resolve([
                {
                    name: "Total_Memory",
                    data: totalMemory.toFixed(2),
                    timestamp: Date.now(),
                },
                {
                    name: "Used_Memory",
                    data: usedMemory.toFixed(2),
                    timestamp: Date.now(),
                },
            ]);
        });
    }
}
exports.default = MemoryMetricCollector;
