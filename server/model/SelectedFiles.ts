import Code from "./Code";

export default class SelectedFiles {
    private files: Set<Code> = new Set();
    
    constructor(file1: Code, file2: Code) {
        this.files.add(file1);
        this.files.add(file2);
    }

    getSelectedFiles(): Set<Code> {
        return this.files;
    }
}