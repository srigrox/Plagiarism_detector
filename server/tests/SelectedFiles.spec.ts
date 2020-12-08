import { expect } from 'chai';
import Code from '../model/Code';
import SelectedFiles from '../model/SelectedFiles';

describe('SelectedFiles Tests', () => {

    describe('constructor and getSelectedFiles()', () => {
        let file1 = new Code("file.py", "print(\"hello world\")");
        let file2 = new Code("file2.py", "print(\"hello worlds!!\")");

        let selectedFiles = new SelectedFiles(file1, file2);
        let iterator = selectedFiles.getSelectedFiles().values()
        let value1 = iterator.next().value;
        let value2 = iterator.next().value;

        it('Returned values that were set using the constructor and then retreived are the same (1)', () => {
            expect(value1).to.deep.equal(file1);
        });

        it('Returned values that were set using the constructor and then retreived are the same (2)', () => {
            expect(value2).to.deep.equal(file2);
        });

        it('Returned values that were set using the constructor and then retreived but switched are not the same (1)', () => {
            expect(value1).to.not.deep.equal(file2);
        });

        it('Returned values that were set using the constructor and then retreived but switched are not the same (2)', () => {
            expect(value2).to.not.deep.equal(file1);
        });
    });
});