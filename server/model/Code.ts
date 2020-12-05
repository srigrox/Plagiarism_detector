import { Module, parse } from "@msrvida/python-program-analysis";
import { json } from "express";
import  IFile from "./IFile";

export default class Code implements IFile {
    private name: string;
    private code: Module;
    private id: string;
    private date: Date;

    // Parses the code in constructor and stores it in code.
    constructor(name: string, code: string) {
        this.name = name;
        this.code = parse(code);
        this.date = new Date();
        this.id = this.hash();
    }

    private hash(): string {
        let out = 0;
        let id = JSON.stringify(this);
        for (let i = 0; i < id.length; i++) {
            let char = id.charCodeAt(i);
            out = ((out << 5) - out) + char;
            out = out & out;
        }
        return out.toString();
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

    // Returns file ID
    getID(): string {
        return this.id;
    }

    // Returns date
    getDate(): string {
        return this.date.toLocaleTimeString([], {year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'});
    }
}