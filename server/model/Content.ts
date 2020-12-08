import IComparison from "./IComparison";

export default class Content implements IComparison {
    private plagiarismSeverity: number;
    private linesAffected: Array<Array<Array<number> | string>>;

    getPlagiarismSeverity(): number {
        return this.plagiarismSeverity;
    }

    setPlagiarismSeverity(ps: number): void {
        if (ps > 100 || ps < 0) {
            throw new Error("Invalid plagiarism severity");
        } else {
            this.plagiarismSeverity = ps;
        }
    }

    getLines(): Array<Array<Array<number> | string>> {
        return this.linesAffected;
    }

    setLines(lines: Array<Array<Array<number> | string>>): void {
        this.linesAffected = lines;
    }
}