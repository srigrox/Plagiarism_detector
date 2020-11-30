import { Module, parse } from "@msrvida/python-program-analysis";
import  IFile from "./IFile";

export default class Code implements IFile {
    private name: string;
    private code: Module;

    // Parses the code in constructor and stores it in code.
    constructor(name: string, code: string) {
        this.name = name;
        this.code = parse(code);
    }

    getName(): string {
        return this.name;
    }

    // Returns list of subfiles of this file, which is none.
    getSubFiles(): Array<IFile> {
        return [];
    }

    // Returns this code in the form of an 1-element list.
    getCode(): Module {
        return this.code;
    }
}