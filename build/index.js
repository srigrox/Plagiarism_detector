"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var python_program_analysis_1 = require("@msrvida/python-program-analysis");
var code = [
    'x, y = 0, 0',
    'while x < 10:',
    '   y += x * 2',
    '   x += 1',
    'print(y)'
];
var tree = python_program_analysis_1.parse(code.join('\n'));
console.log(tree);
