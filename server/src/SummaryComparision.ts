import ComparisonFactory from "../model/ComparisonFactory"

class SummaryComparision {

    comparedFiles : SelectedFiles
    comparisions : Array<IComparision>
    factory: ComparisonFactory

    constructor(comparedFiles : SelectedFiles, comparisions : Array, factory: ComparisonFactory) {
        this.comparedFiles = comparedFiles;
        this.comparisions = comparisions;
        this.factory = factory
    }

    function generateComparisions() : void {

    }
}

export default SummaryComparision