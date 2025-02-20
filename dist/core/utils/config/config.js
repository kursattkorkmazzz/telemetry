"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const defaultConfig_js_1 = __importDefault(require("./defaultConfig.js"));
const config = {
    ...(0, defaultConfig_js_1.default)(),
};
exports.default = config;
