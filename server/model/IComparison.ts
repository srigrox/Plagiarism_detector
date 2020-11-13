import SelectedFiles from "./SelectedFiles";

export default interface IComparison {
    comparedFiles: SelectedFiles;
    starred: boolean;
    ignored: boolean;

    summary: string;

    PlagiarismSeverity(): number

    flipStar(): void
    flipIgnored(): void
}
