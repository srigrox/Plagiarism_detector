import ComparisonFactory from "./ComparisonFactory"
import IComparison from "./IComparison";
import SelectedFiles from "./SelectedFiles";
import { folderStructureCompare } from "./Utils";

export default class SummaryComparison {
    private comparedFiles : SelectedFiles
    private comparisions : Array<IComparison>
    private factory: ComparisonFactory
    // TODO: Implement factory

    constructor(comparedFiles: SelectedFiles) {
        this.comparedFiles = comparedFiles;
        this.generateComparisions();
    }

    getComparedFiles(): SelectedFiles {
        return this.comparedFiles;
    }

    getComparisons(): Array<IComparison> {
        return this.comparisions;
    }

    generateComparisions() : void {
        console.log(folderStructureCompare(this.comparedFiles));
        // TODO: Create the comparison
    }
}