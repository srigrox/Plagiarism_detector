import IFile from "./IFile";
import SelectedFiles from "./SelectedFiles";
import SummaryComparison from "./SummaryComparison";

export default class User {
    private username: string;
    private password: string;
    private files: Array<IFile>;
    private comparisons: Array<SummaryComparison>;
    selectedFiles?: SelectedFiles;

    constructor(username: string, password: string, ) {
        this.username = username;
        this.password = password;
        this.files = Array<IFile>();
        this.comparisons = Array<SummaryComparison>();
    }

    getUsername(): string {
        return this.username;
    }

    getFiles(): Array<IFile> {
        return this.files;
    }

    getComparisons(): Array<SummaryComparison> {
        return this.comparisons;
    }

    uploadFile(file: IFile): void {
        this.files.push(file);
    }

    createSelection(file1: IFile, file2: IFile): void {
        this.selectedFiles = new SelectedFiles(file1, file2);
    }

    makeSummary(): void {
        // Create the summary comparison based on the files selected
    }
}