import { Module, parse } from "@msrvida/python-program-analysis";
import { json } from "express";

export default class Code {
    private name: string;
    private code: Module;
    private plainCode: Array<string>;
    private id: string;
    private date: Date;

    // Parses the code in constructor and stores it in code.
    constructor(name: string, code: string) {
        this.name = name;
        this.code = parse(code);
        this.plainCode = code.split("\n");
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

    // Returns name.
    getName(): string {
        return this.name;
    }

    // Returns list of subfiles of this file, which is none.
    getSubFiles(): Array<Code> {
        return [];
    }

    // Returns this code in the form of an 1-element list.
    getCode(): Module {
        return this.code;
    }

    // Gets plain code.
    getPlainCode(): Array<string> {
        return this.plainCode;
    }

    // Returns file ID.
    getID(): string {
        return this.id;
    }

    // Returns date.
    getDate(): string {
        return this.date.toLocaleTimeString([], {year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'});
    }
}