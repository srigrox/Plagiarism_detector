import { expect } from 'chai';
import Code from '../model/Code';
import User from '../model/User';

describe('User Tests', () => {

    describe('constructor', () => {
        let user = new User("username", "password");

        it('Calling the constructor creates an object of the same type', () => {
            expect(typeof new User("a", "b")).to.equal(typeof user);
        });
    });

    describe('getUsername()', () => {
        let user = new User("username", "password");

        it('Calling the username returns the same as given in the constructor', () => {
            expect(user.getUsername()).to.equal("username");
        });
    });

    describe('getFiles() after zero uploads', () => {
        let user = new User("username", "password");
        
        it('The size of the file array should be one after one upload', () => {
            expect(user.getFiles().length).to.equal(0);
        });
    });

    describe('getFiles() after one upload', () => {
        let user = new User("username", "password");
        let file1 = new Code("file.py", "print(\"hello world\")");
        user.uploadFile(file1);
        
        it('The size of the file array should be one after one upload', () => {
            expect(user.getFiles().length).to.equal(1);
        });
        
        it('The file id should be the same after the upload', () => {
            expect(user.getFiles()[0].getID()).to.equal(file1.getID());
        });
    });

    describe('getFiles() after two uploads', () => {
        let user = new User("username", "password");
        let file1 = new Code("file.py", "print(\"hello world\")");
        let file2 = new Code("file2.py", "print(\"hello worlds!!\")");
        user.uploadFile(file1);
        user.uploadFile(file2);

        it('The size of the file array should be two after a second upload', () => {
            expect(user.getFiles().length).to.equal(2);
        });
    });

    describe('getComparisons() after zero comparisons', () => {
        let user = new User("username", "password");

        it('The size of the comparison array should be zero', () => {
            expect(user.getComparisons().length).to.equal(0);
        });
    });

    describe('getComparisons() after one comparison', () => {
        let user = new User("username", "password");
        let file1 = new Code("file.py", "print(\"hello world\")");
        let file2 = new Code("file2.py", "print(\"hello worlds!!\")");
        user.uploadFile(file1);
        user.uploadFile(file2);
        user.createSelection(file1.getID(), file2.getID())
        user.makeSummary();

        it('The size of the comparison array should be one after a compare', () => {
            expect(user.getComparisons().length).to.equal(1);
        });
    });

    describe('getComparisons() after two comparisons of the same file', () => {
        let user = new User("username", "password");
        let file1 = new Code("file.py", "print(\"hello world\")");
        let file2 = new Code("file2.py", "print(\"hello worlds!!\")");
        user.uploadFile(file1);
        user.uploadFile(file2);
        user.createSelection(file1.getID(), file2.getID())
        user.makeSummary();
        user.createSelection(file2.getID(), file1.getID())
        user.makeSummary();

        it('The size of the comparison array should be one after two comparisons of the same file', () => {
            expect(user.getComparisons().length).to.equal(1);
        });
    });

    describe('getSelectedFiles()', () => {
        let user = new User("username", "password");
        let file1 = new Code("file.py", "print(\"hello world\")");
        let file2 = new Code("file2.py", "print(\"hello worlds!!\")");
        user.uploadFile(file1);
        user.uploadFile(file2);
        user.createSelection(file1.getID(), file2.getID())

        let iterator = user.getSelectedFiles().getSelectedFiles().values()
        let value1 = iterator.next().value;
        let value2 = iterator.next().value;
        
        it('The values from getting the file should be the same as the values that are uploaded (1)', () => {
            expect(value1).to.deep.equal(file1);
        });

        it('The values from getting the file should be the same as the values that are uploaded (2)', () => {
            expect(value2).to.deep.equal(file2);
        });

        it('The values from getting the file should be the same as the values that are uploaded when the order is switched (1)', () => {
            expect(value1).to.not.deep.equal(file2);
        });

        it('The values from getting the file should be the same as the values that are uploaded when the order is switched (2)', () => {
            expect(value2).to.not.deep.equal(file1);
        });
    });

    describe('removeComparison()', () => {
        let user = new User("username", "password");
        let file1 = new Code("file.py", "print(\"hello world\")");
        let file2 = new Code("file2.py", "print(\"hello worlds!!\")");
        user.uploadFile(file1);
        user.uploadFile(file2);
        user.createSelection(file1.getID(), file2.getID())
        user.makeSummary();
        let compID = user.getComparisons()[0].getID()
        user.removeComparison(compID);

        it('The size of the comparison array should be one after two comparisons of the same file', () => {
            expect(user.getComparisons().length).to.equal(0);
        });

        let id: string
        while (id === undefined || id === compID) {
            id = Math.round((Math.random() * 100000)).toString()
        }

        it('Should throw an error when the ID is invalid', () => {
            expect(user.removeComparison.bind(user, id)).to.throw();
        });
    });

    describe('removeComparison() when a comparison is double submitted', () => {
        let user = new User("username", "password");
        let file1 = new Code("file.py", "print(\"hello world\")");
        let file2 = new Code("file2.py", "print(\"hello worlds!!\")");
        user.uploadFile(file1);
        user.uploadFile(file2);
        user.createSelection(file1.getID(), file2.getID())
        user.makeSummary();
        user.createSelection(file2.getID(), file1.getID())
        user.makeSummary();
        user.removeComparison(user.getComparisons()[0].getID());

        it('The size of the comparison array should be one after two comparisons of the same file', () => {
            expect(user.getComparisons().length).to.equal(0);
        });
    });

    describe('uploadFile() one file', () => {
        let user = new User("username", "password");
        let file1 = new Code("file.py", "print(\"hello world\")");
        user.uploadFile(file1);

        it('The size of the file array should be one after an upload', () => {
            expect(user.getFiles().length).to.equal(1);
        });
    });

    describe('uploadFile() two files', () => {
        let user = new User("username", "password");
        let file1 = new Code("file.py", "print(\"hello world\")");
        let file2 = new Code("file2.py", "print(\"hello worlds!!\")");
        user.uploadFile(file1);
        user.uploadFile(file2);

        it('The size of the file array should be two after two uploads', () => {
            expect(user.getFiles().length).to.equal(2);
        });
    });

    describe('removeFile()', () => {
        let user = new User("username", "password");
        let file1 = new Code("file.py", "print(\"hello world\")");
        user.uploadFile(file1);
        user.removeFile(file1.getID());

        it('The size of the file array should be zero after an upload and a delete', () => {
            expect(user.getFiles().length).to.equal(0);
        });

        let id = Math.round(Math.random() * 100000).toString();

        it('Should throw an error if the file doesn\'t exist', () => {
            expect(user.removeFile.bind(user, id)).to.throw();
        });
    });

    describe('removeFile() after uploading two', () => {
        let user = new User("username", "password");
        let file1 = new Code("file.py", "print(\"hello world\")");
        let file2 = new Code("file2.py", "print(\"hello worlds!!\")");
        user.uploadFile(file1);
        user.uploadFile(file2);
        user.removeFile(file1.getID());

        it('The size of the file array should be zero after an upload and a delete', () => {
            expect(user.getFiles().length).to.equal(1);
        });
    });

    describe('createSelection()', () => {
        let user = new User("username", "password");
        let file1 = new Code("file.py", "print(\"hello world\")");
        let file2 = new Code("file2.py", "print(\"hello worlds!!\")");
        let file3 = new Code("file3.py", "print(\"hello worlz!!\")");
        user.uploadFile(file1);
        user.uploadFile(file2);
        user.uploadFile(file3);
        user.createSelection(file1.getID(), file2.getID());

        let selection1 = user.getSelectedFiles();

        user.createSelection(file1.getID(), file3.getID());
        
        let selection2 = user.getSelectedFiles();

        let iterator1 = selection1.getSelectedFiles().values()
        let value1 = iterator1.next().value;
        let value2 = iterator1.next().value;

        let iterator2 = selection2.getSelectedFiles().values()
        let value3 = iterator2.next().value;
        let value4 = iterator2.next().value;

        it('Two different selections are not equal', () => {
            expect(selection1).to.not.deep.equal(selection2);
        });
        
        it('Two different selections\' values are equal', () => {
            expect(value1).to.deep.equal(value3);
        });

        it('Two different selections\' values are not equal', () => {
            expect(value2).to.not.deep.equal(value4);
        });

        let id: string
        while (id === undefined || id === file1.getID() || id === file2.getID() || id === file3.getID()) {
            id = Math.round((Math.random() * 100000)).toString()
        }

        it('Throws error when trying to make selections from nonexisting files', () => {
            expect(user.createSelection.bind(user, id, file1.getID())).to.throw();
        });

        it('Throws error when file IDs are the same', () => {
            expect(user.createSelection.bind(user, file1.getID(), file1.getID())).to.throw();
        });
    });
    
    describe('makeSummary()', () => {
        let user = new User("username", "password");
        let file1 = new Code("file.py", "print(\"hello world\")");
        let file2 = new Code("file2.py", "print(\"hello worlds!!\")");
        user.uploadFile(file1);
        user.uploadFile(file2);
        user.createSelection(file1.getID(), file2.getID());
        user.makeSummary();

        it('The size of the comparison array should be one after two comparisons of the same file', () => {
            expect(user.getComparisons().length).to.equal(1);
        });
    });
});