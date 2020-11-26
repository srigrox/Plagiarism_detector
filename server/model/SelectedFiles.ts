import IFile from "./IFile";


export default class SelectedFiles {
    private files: Set<IFile> = new Set();
    
    constructor(file1: IFile, file2: IFile) {
        this.files.add(file1);
        this.files.add(file2);
    }

    getSelectedFiles(): Set<IFile> {
        return this.files;
    }
}