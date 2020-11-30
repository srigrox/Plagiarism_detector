import { Module } from "@msrvida/python-program-analysis";
import { exception } from "console";
import  IFile from "./IFile";

export default class Folder implements IFile {
    private name: string;

    // Stores a list of all the subfiles of this folder.
    private subFiles: Array<IFile>

    constructor(name: string, subFiles: Array<IFile>) {
        this.name = name;
        this.subFiles = subFiles;
    }

    getName(): string {
        return this.name;
    }

    // Adds file to list of subfiles.
    addFile(file: IFile) : void {
        this.subFiles.push(file)
    }

    // Gets list of subfiles of this folder.
    getSubFiles(): Array<IFile> {
        return this.subFiles;
    }
    
    // Cannot get code from a folder, throws exception.
    getCode(): Module {
        throw new Error("Cannot get code from a folder");
    }
}