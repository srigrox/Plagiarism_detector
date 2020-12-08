import { expect } from 'chai';
import Code from '../model/Code';
import Content from '../model/Content';
import SelectedFiles from '../model/SelectedFiles';
import SummaryComparison from '../model/SummaryComparison';
import TextualDiff from '../model/TextualDiff';

describe('Summary Comparison Tests', () => {

    describe('getComparedFiles()', () => {
        let file1 = new Code("file.py", "print(\"hello world\")\nprint(\"hello world\")");
        let file2 = new Code("file2.py", "print(\"hello worlds!!\")\nprint(\"hello world\")");

        let selectedFiles = new SelectedFiles(file1, file2);
        let summaryComparison = new SummaryComparison(selectedFiles);

        it('Should get selected files that were inputted in the constructor', () => {
            expect(summaryComparison.getComparedFiles()).to.deep.equal(selectedFiles);
        });
    });

    describe('getComparisons()', () => {
        let file1 = new Code("file.py", "print(\"hello world\")");
        let file2 = new Code("file2.py", "print(\"hello worlds!!\")");

        let selectedFiles = new SelectedFiles(file1, file2);
        let summaryComparison = new SummaryComparison(selectedFiles);

        it('Should return two comparisons, content and text diff', () => {
            expect(summaryComparison.getComparisons().length).to.equal(2);
        });

        it('First comparison should be of type Content', () => {
            expect(typeof summaryComparison.getComparisons()[0]).to.equal(typeof new Content());
        });

        it('Second comparison should be of type TextualDiff', () => {
            expect(typeof summaryComparison.getComparisons()[1]).to.equal(typeof new TextualDiff());
        });
    });

    describe('getID()', () => {
        let file1 = new Code("file.py", "print(\"hello world\")");
        let file2 = new Code("file2.py", "print(\"hello worlds!!\")");

        let selectedFiles = new SelectedFiles(file1, file2);
        let summaryComparison = new SummaryComparison(selectedFiles);

        it('ID returned should equal the IDs of the two files added', () => {
            expect(parseInt(summaryComparison.getID())).to.equal(parseInt(file1.getID()) + parseInt(file2.getID()));
        });
    });

    describe('getDate()', () => {
        let file1 = new Code("file.py", "print(\"hello world\")");
        let file2 = new Code("file2.py", "print(\"hello worlds!!\")");

        let selectedFiles = new SelectedFiles(file1, file2);
        let summaryComparison = new SummaryComparison(selectedFiles);
        let date = new Date();

        it('Returned date should be equal to date at the time summary comparison object was created', () => {      
            expect(summaryComparison.getDate()).to.deep.equal(date.toLocaleTimeString([], {
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