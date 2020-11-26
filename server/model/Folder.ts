import  IFile from "./IFile";

export class Folder implements IFile {
    private subFiles: Array<IFile>

    constructor(subFiles: Array<IFile>) {
        this.subFiles = subFiles;
    }

    getSubFiles(): Array<IFile> {
        return this.subFiles;
    }
}