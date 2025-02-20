"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MemoryMetricCollector_1 = __importDefault(require("./collectors/MemoryMetricCollector"));
const Task_1 = __importDefault(require("./core/Task"));
const IntervalScheduler_1 = __importDefault(require("./schedulers/IntervalScheduler"));
const PrintConsolePublisher_1 = __importDefault(require("./publishers/PrintConsolePublisher"));
const task = new Task_1.default("");
task
    .metricCollector(MemoryMetricCollector_1.default)
    .scheduler(IntervalScheduler_1.default, {
    collectIntervalInMS: 3000,
    publishIntervalInMS: 5000,
})
    .publisher(PrintConsolePublisher_1.default)
    .start();
