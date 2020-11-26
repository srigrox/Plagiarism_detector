import { ComparisonFactory } from "./ComparisonFactory"
import IComparison from "./IComparison";
import SelectedFiles from "./SelectedFiles";

export class SummaryComparison {
    private comparedFiles : SelectedFiles
    private comparisions : Array<IComparison>
    private factory: ComparisonFactory

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
        // RUN COMPARISON UTILS ON THIS FILE
    }
}