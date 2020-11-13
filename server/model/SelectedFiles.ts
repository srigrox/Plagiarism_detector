import IFile from "./IFile";


export default class SelectedFiles {
    file1 : IFile;
    file2 : IFile;
    
    constructor() {

    }

    setFile1(file : IFile) : void {
        this.file1 = file;
    }

    setFile2(file : IFile) : void {
        this.file2 = file;
    }
}