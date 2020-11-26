import IFile from "./IFile";


export default class SelectedFiles {
    private file1 : IFile;
    private file2 : IFile;
    
    constructor(file1: IFile, file2: IFile) {
        this.file1 = file1;
        this.file2 = file2;
    }

    setFile1(file : IFile) : void {
        this.file1 = file;
    }

    setFile2(file : IFile) : void {
        this.file2 = file;
    }
}