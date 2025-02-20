"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractPublisher_1 = __importDefault(require("../core/abstracts/AbstractPublisher"));
class PrintConsolePublisher extends AbstractPublisher_1.default {
    name = "Consoler Printer";
    publish(data) {
        if (!Array.isArray(data)) {
            this.printMetricData(data);
            return Promise.resolve();
        }
        data.forEach((md) => this.printMetricData(md));
        return Promise.resolve();
    }
    printMetricData(data) {
        console.log("========================");
        console.log("Name: " + data.name);
        console.log("Timestamps: " + data.timestamp);
        console.log("Data: " + data.data);
        console.log("========================");
    }
}
exports.default = PrintConsolePublisher;
