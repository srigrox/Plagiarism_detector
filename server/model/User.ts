import Code from "./Code";
import IComparison from "./IComparison";
import SelectedFiles from "./SelectedFiles";
import SummaryComparison from "./SummaryComparison";

export default class User {
    private username: string;
    private password: string;
    private files: Array<Code>;
    private comparisons: Array<SummaryComparison>;
    selectedFiles?: SelectedFiles;

    constructor(username: string, password: string, ) {
        this.username = username;
        this.password = password;
        this.files = Array<Code>();
        this.comparisons = Array<SummaryComparison>();
    }

    getUsername(): string {
        return this.username;
    }

    getFiles(): Array<Code> {
        return this.files;
    }

    getComparisons(): Array<SummaryComparison> {
        return this.comparisons;
    }

    removeComparison(id: string): void {
        const index = this.comparisons.findIndex((f) => f.getID() === id);

        if (index > -1) {
            this.comparisons.splice(index, 1);
        } else {
            throw new Error("Comparison not found");
        }
    }

    uploadFile(file: Code): void {
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

    createSelection(f1: string, f2: string): void {
        let file1: Code
        let file2: Code

        this.files.forEach((file) => {
            const id = file.getID()
            if(id === f1) {
                file1 = file;
            } else if(id === f2) {
                file2 = file;
            }
        })

        if(file1 === undefined || file2 === undefined) {
            throw new Error("One or more files not found");
        } else {
            this.selectedFiles = new SelectedFiles(file1, file2);
        }
    }

    makeSummary(): void {
        let iterator = this.selectedFiles.getSelectedFiles().values();
        let file1: string = iterator.next().value.getID();
        let file2: string = iterator.next().value.getID();
        let id = (parseInt(file1) + parseInt(file2)).toString();

        let comparison: SummaryComparison;
        this.comparisons.forEach((comp) => {
            if(comp.getID() === id) {
                comparison = comp;
            }
        });

        if(comparison !== undefined) {
            let index = this.comparisons.findIndex((comp) => comp.getID());
            this.comparisons.splice(index, 1)
        } 
        this.comparisons.push(new SummaryComparison(this.selectedFiles));
    }
}