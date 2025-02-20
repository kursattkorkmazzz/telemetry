"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PrintError;
function PrintError(e) {
    console.log(e instanceof Error ? e.message : e);
}
