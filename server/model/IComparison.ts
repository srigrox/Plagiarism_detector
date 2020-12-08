export default interface IComparison {
    getPlagiarismSeverity(): number;

    setPlagiarismSeverity(ps: number): void;

    getLines(): Array<Array<Array<number> | string>>;

    setLines(lines: Array<Array<Array<number> | string>>): void;
}
