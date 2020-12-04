import { Module } from "@msrvida/python-program-analysis";

export default interface IFile {
    // Gets name of file
    getName(): string;

    // Gets list of subfiles of this file
    getSubFiles(): Array<IFile>;

    // Gets code from file or all subfiles in a list.
    getCode(): Module;

    // Gets file ID
    getID(): number;
}