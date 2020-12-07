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
    private id: string;
    private date: Date;

    constructor(comparedFiles: SelectedFiles) {
        this.comparedFiles = comparedFiles;
        this.comparisons = [];
        this.factory = new ComparisonFactory();
        let iterator = comparedFiles.getSelectedFiles().values()
        this.id = (parseInt(iterator.next().value.getID()) 
                  + parseInt(iterator.next().value.getID())).toString();
        this.date = new Date();
        this.generateComparisons();
    }

    getComparedFiles(): SelectedFiles {
        return this.comparedFiles;
    }

    getComparisons(): Array<IComparison> {
        return this.comparisons;
    }

    getID(): string {
        return this.id;
    }

    // Returns date.
    getDate(): string {
        return this.date.toLocaleTimeString([], {year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'});
    }

    // Calls the algorithm and formats into backend
    generateComparisons() : void {
        this.comparisons = [];
        const algoOutput = compareAlgorithm(this.comparedFiles);

        let content = this.factory.makeComparison("content");
        content.setPlagiarismSeverity(algoOutput.content_check.Plagarised);
        content.setLines(algoOutput.content_check["Line numbers"])
        this.comparisons.push(content);

        let lines: Array<Array<Array<number> | string>> = algoOutput["textual diff"]["Line numbers"].map((line) => {
            return [line.slice(0, 2), line.slice(2, 4), "textDiff"];
        })

        let td = this.factory.makeComparison("textDiff");
        td.setPlagiarismSeverity(algoOutput["textual diff"].Plagarised);
        td.setLines(lines);
        this.comparisons.push(td);
    }
}