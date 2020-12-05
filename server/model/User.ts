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

    removeFile(id: string): void {
        const index = this.files.findIndex((f) => f.getID() === id);
        
        if (index > -1) {
            this.files.splice(index, 1);
        } else {
            throw new Error("File not found");
        }
    }

    createSelection(file1: IFile, file2: IFile): void {
        this.selectedFiles = new SelectedFiles(file1, file2);
    }

    makeSummary(): void {
        this.comparisons.push(new SummaryComparison(this.selectedFiles));
    }
}