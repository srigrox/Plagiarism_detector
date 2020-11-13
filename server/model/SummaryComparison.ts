import ComparisonFactory from "./ComparisonFactory"
import IComparison from "./IComparison";
import SelectedFiles from "./SelectedFiles";

class SummaryComparison {

    comparedFiles : SelectedFiles
    comparisions : Array<IComparison>
    factory: ComparisonFactory

    constructor(comparedFiles : SelectedFiles, comparisions : Array<IComparison>, factory: ComparisonFactory) {
        this.comparedFiles = comparedFiles;
        this.comparisions = comparisions;
        this.factory = factory
    }

    generateComparisions() : void {

    }
}

export default SummaryComparison