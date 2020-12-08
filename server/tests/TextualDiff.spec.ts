import { expect } from 'chai';
import ComparisonFactory from '../model/ComparisonFactory';

describe('TextualDiff Tests', () => {

    describe('getPlagiarismSeverity()', () => {
        let comparisonFactory = new ComparisonFactory();
        let content = comparisonFactory.makeComparison("textDiff");

        content.setPlagiarismSeverity(50);

        it('Should return the same plagiarism severity as it is set', () => {
            expect(content.getPlagiarismSeverity()).to.equal(50);
        });
    });

    describe('setPlagiarismSeverity()', () => {
        let comparisonFactory = new ComparisonFactory();
        let content = comparisonFactory.makeComparison("textDiff");

        content.setPlagiarismSeverity(50);

        it('Should return the same plagiarism severity as it is set', () => {
            expect(content.getPlagiarismSeverity()).to.equal(50);
        });

        it('Should throw an error if the plagiarism severity is too large', () => {
            expect(content.setPlagiarismSeverity.bind(content, 1000)).to.throw();
        });

        it('Should throw an error if the plagiarism severity is too small', () => {
            expect(content.setPlagiarismSeverity.bind(content, -1)).to.throw();
        });
    });

    describe('getLines()', () => {
        let comparisonFactory = new ComparisonFactory();
        let content = comparisonFactory.makeComparison("textDiff");

        content.setLines([[[4, 3], "hello"]]);

        it('Should return the same lines as it is set', () => {
            expect(content.getLines()).to.deep.equal([[[4, 3], "hello"]]);
        });
    });

    describe('setLines()', () => {
        let comparisonFactory = new ComparisonFactory();
        let content = comparisonFactory.makeComparison("textDiff");

        content.setLines([[[1, 2], "goodbye"]]);

        it('Should return the same lines as it is set', () => {
            expect(content.getLines()).to.deep.equal([[[1, 2], "goodbye"]]);
        });
    });
});