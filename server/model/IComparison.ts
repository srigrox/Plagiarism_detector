import SelectedFiles from "./SelectedFiles";

interface IComparison {
    comparedFiles: SelectedFiles;
    starred: boolean;
    ignored: boolean;

    summary: string;

    PlagiarismSeverity(): number

    flipStar(): void
    flipIgnored(): void
}

export default IComparison;