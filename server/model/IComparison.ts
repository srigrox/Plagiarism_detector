import SelectedFiles from "./SelectedFiles";

export default interface IComparison {
    summary: string;

    getPlagiarismSeverity(): number;

    setPlagiarismSeverity(ps: number): void;

    getLines(): Array<Array<Array<number> | string>>;

    setLines(lines: Array<Array<Array<number> | string>>): void;

    flipStar(): void
    flipIgnored(): void
}
