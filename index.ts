import { parse } from "@msrvida/python-program-analysis"

const code = [
    'x, y = 0, 0',
    'while x < 10:',
    '   y += x * 2',
    '   x += 1',
    'print(y)'
];

const tree = parse(code.join('\n')); 

console.log(tree)
