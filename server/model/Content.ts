import IComparison from "./IComparison";

export default class Content implements IComparison {
    private comparedFiles: any;
    private starred: boolean;
    private ignored: boolean;
    summary: string;
    private plagiarismSeverity: number;
    private linesAffected: Array<Array<Array<number> | string>>;

    getPlagiarismSeverity(): number {
        return this.plagiarismSeverity;
    }

    setPlagiarismSeverity(ps: number): void {
        this.plagiarismSeverity = ps;
    }

    getLines(): Array<Array<Array<number> | string>> {
        return this.linesAffected;
    }

    setLines(lines: Array<Array<Array<number> | string>>): void {
        this.linesAffected = lines;
    }

    flipStar(): void {
        throw new Error("Method not implemented.");
    }
    
    flipIgnored(): void {
        throw new Error("Method not implemented.");
    }

}