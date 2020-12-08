import { expect } from 'chai';
import ComparisonFactory from '../model/ComparisonFactory';
import Content from '../model/Content';
import TextualDiff from '../model/TextualDiff';

describe('ComparisonFactory Tests', () => {

    describe('makeComparison()', () => {
        let comparisonFactory = new ComparisonFactory();

        it('Making Content comparison', () => {      
            expect(typeof comparisonFactory.makeComparison("content")).to.equal(typeof new Content());
        });

        it('Making textDiff comparison', () => {      
            expect(typeof comparisonFactory.makeComparison("textDiff")).to.equal(typeof new TextualDiff());
        });

        it('Making undefined comparison', () => {      
            expect(comparisonFactory.makeComparison("asdf")).to.be.null;
        });
    });
});