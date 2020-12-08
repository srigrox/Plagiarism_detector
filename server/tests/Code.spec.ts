import { parse } from '@msrvida/python-program-analysis';
import { expect } from 'chai';
import Code from '../model/Code';

describe('Code Tests', () => {

    describe('getName()', () => {
        let code = new Code("file.py", "print(\"hello world\")");

        it('Name of code should be the same as what was inputted', () => {      
            expect(code.getName()).to.equal("file.py");
        });
    });

    describe('getCode()', () => {
        let code = new Code("file.py", "print(\"hello world\")");

        it('Returned code should be equal to the parsed version of code', () => {      
            expect(code.getCode()).to.deep.equal(parse("print(\"hello world\")"));
        });
    });

    describe('getPlainCode()', () => {
        let code = new Code("file.py", "print(\"hello world\")");
        let code1 = new Code("file1.py", "print(\"hello world\")\nprint(\"hello worlds!!\")");

        it('Returned code should be equal to an array of the string version of code', () => {      
            expect(code.getPlainCode()).to.deep.equal(["print(\"hello world\")"]);
        });

        it('Returned code should be equal to an array of the string version of code, split by line', () => {      
            expect(code1.getPlainCode()).to.deep.equal(["print(\"hello world\")", "print(\"hello worlds!!\")"]);
        });
    });

    describe('getID()', () => {
        let code = new Code("file.py", "print(\"hello world\")");

        it('Returned ID should be a number', () => {      
            expect(parseInt(code.getID())).to.be.above(-Number.MAX_VALUE);
        });
    });

    describe('getDate()', () => {
        let code = new Code("file.py", "print(\"hello world\")");
        let date = new Date()

        it('Returned date should be equal to date at the time code object was created', () => {      
            expect(code.getDate()).to.deep.equal(date.toLocaleTimeString([], {
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit'
            }));
        });
    });
});