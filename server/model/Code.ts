import  IFile from "./IFile";

export class Code implements IFile {
    private code: string;

    constructor(code: string) {
        this.code = code;
    }

    getCode(): string {
        return this.code;
    }
}