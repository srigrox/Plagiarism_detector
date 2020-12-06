import Content from "./Content";
import ComparisonFactory from "./ComparisonFactory"
import IComparison from "./IComparison";
import SelectedFiles from "./SelectedFiles";
import { compareAlgorithm } from "./Utils";

export default class SummaryComparison {
    private comparedFiles : SelectedFiles;
    private comparisons : Array<IComparison>;
    private plagiarismPercentage : number;
    private factory: ComparisonFactory;
    private id: number;
    // TODO: Implement factory

    constructor(comparedFiles: SelectedFiles) {
        this.comparedFiles = comparedFiles;
        this.comparisons = [];
        this.factory = new ComparisonFactory();
        this.generateComparisons();
    }

    getComparedFiles(): SelectedFiles {
        return this.comparedFiles;
    }

    getComparisons(): Array<IComparison> {
        return this.comparisons;
    }

    getPlagiarismPercentage(): number {
        return this.plagiarismPercentage;
    }

    // Calls the algorithm and formats into backend
    generateComparisons() : void {
        this.comparisons = [];
        const algoOutput = compareAlgorithm(this.comparedFiles);

        let content = this.factory.makeComparison("content");
        content.setPlagiarismSeverity(algoOutput.content_check.Plagarised);
        content.setLines(algoOutput.content_check["Line numbers"])
        this.comparisons.push(content);

        let lines: Array<Array<Array<number> | string>> = algoOutput["textual diff"].map((line) => {
            return [line.slice(0, 2), line.slice(2, 4), "textDiff"];
        })

        let td = this.factory.makeComparison("textDiff");
        td.setPlagiarismSeverity(0);
        td.setLines(lines);
        this.comparisons.push(td);
    }
}