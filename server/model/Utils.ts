import IFile from "./IFile";
import Folder from "./Folder";
import Code from "./Code";
import SelectedFiles from "./SelectedFiles";
import { Block, ControlFlowGraph, SyntaxNode, walk } from "@msrvida/python-program-analysis";


export function compareAlgorithm(selectedFiles: SelectedFiles) {

    let iterator = selectedFiles.getSelectedFiles().values()

    let file1 : Code = iterator.next().value
    let file2 : Code = iterator.next().value

    return compare(file1, file2)
}

function compare(f1:Code, f2:Code) {
    return {"content_check" : compareFiles(f1, f2), "textual diff" : textualDiff(f1, f2)}
}

function compareFiles(f1:Code, f2:Code) : {"Plagarised": number, "Line numbers": (("assign" | number[])[] | ("binop" | number[])[] | ("literal" | number[])[] | ("call" | number[])[] | ("def" | number[])[] | ("else" | number[])[])[]} {
    let c1 = f1.getCode() 
    let c2 = f2.getCode() 

    let cfg1 = new ControlFlowGraph(c1)

    let cfg2 = new ControlFlowGraph(c2)


    let blocks1 = cfg1.blocks

    let blocks2 = cfg2.blocks

    let simBlocks = []

    let line_numbers = []

    let typeList = ["assign"]


    for (let i = 0; i < blocks1.length; i++) {
        for (let y = 0; y < blocks2.length; y++) {
            if(blocks1[i].statements && blocks1[i].statements) {
                let u = 0
                for(let z = 0; z < blocks1[i].statements.length; z++) {

                    if(blocks1[i].statements[z] && blocks2[y].statements[z]) {
                        if(blocks1[i].statements[z].type === blocks2[y].statements[z].type) {
                            let a = blocks1[i].statements[z]
                            let b = blocks2[y].statements[z]
                            // console.log(a.type, "a is")
                            // console.log(b.type, "b is")

                            if((a.type == "assign" && b.type == "assign")) {
                                let a_loc = [a.location.first_line, a.location.last_line]
                                let b_loc = [b.location.first_line, b.location.last_line]
                                if(checkAssign(a, b)) {
                                    // simBlocks.push([blocks1[i], blocks2[y]])
                                    u = u + 1
                                    line_numbers.push([a_loc, b_loc, a.type])
                                }
                            }

                            if(a.type == "binop" && b.type == "binop") {
                                let a_loc = [a.location.first_line, a.location.last_line]
                                let b_loc = [b.location.first_line, b.location.last_line]
                                if(a.left.type == b.left.type && a.right.type == b.right.type) {
                                    if(a.right.type == "name" && b.right.type == "name") {
                                        if(a.right.id == b.right.id) {
                                            // simBlocks.push([blocks1[i], blocks2[y]])
                                            u = u + 1
                                            line_numbers.push([a_loc, b_loc, a.type])
                                        }
                                    }
                                    else if(a.right.type == "literal" && b.right.type == "literal") {
                                        if(a.right.value == b.right.value) {
                                            // simBlocks.push([blocks1[i], blocks2[y]])
                                            u = u + 1
                                            line_numbers.push([a_loc, b_loc, a.type])
                                        }
                                    }
                                    else if(a.left.type == "literal" && b.left.type == "literal") {
                                        if(a.left.value == b.left.value) {
                                            // simBlocks.push([blocks1[i], blocks2[y]])
                                            u = u + 1
                                            line_numbers.push([a_loc, b_loc, a.type])
                                        }
                                    }
                                }
    
                            }

                            if(a.type == "literal" && b.type == "literal") {
                                let a_loc = [a.location.first_line, a.location.last_line]
                                let b_loc = [b.location.first_line, b.location.last_line]
                                if(a.value == b.value) {
                                    // simBlocks.push([blocks1[i], blocks2[y]])
                                    u = u + 1
                                    line_numbers.push([a_loc, b_loc, a.type])
                                }
                            }
    

                            if(a.type == "call" && b.type == "call") {
                                let a_loc = [a.location.first_line, a.location.last_line]
                                let b_loc = [b.location.first_line, b.location.last_line]
                                // console.log(a.args, "args")
                                if(checkCall(a, b)) {
                                    // simBlocks.push([blocks1[i], blocks2[y]])
                                    u = u + 1
                                    line_numbers.push([a_loc, b_loc, a.type])
                                    
                                }
    
                            }

                            if(a.type == "def" && b.type == "def") {
                                let a_loc = [a.location.first_line, a.location.last_line]
                                let b_loc = [b.location.first_line, b.location.last_line]
                                if(checkDef(a, b)) {
                                    u = u + 1
                                    line_numbers.push([a_loc, b_loc, a.type])
                                }
                                                                
                            }

                            if(a.type == "else" && b.type == "else") {
                                let a_loc = [a.location.first_line, a.location.last_line]
                                let b_loc = [b.location.first_line, b.location.last_line]
                                if(checkElse(a, b)) {
                                    u = u + 1
                                    line_numbers.push([a_loc, b_loc, a.type])
                                }
    
                            }
    
                        }
                    }
                }

                if(u > 0.6 * blocks1[i].statements.length) {
                    if(checkBlockIsThere(blocks2[y], simBlocks)) {
                    }
                    else {
                        simBlocks.push([blocks1[i], blocks2[y]])
                    break
                    }
                }
            }
        }
    }

    // console.log(blocks1, "length")
    // // console.log(simBlocks, "length 2")
    // console.log(checkCall(blocks1[7].statements[0], blocks2[7].statements[0]), "check call")
    // console.log(arraysEqual([ 'call', 'literal', 'literal', 'name', 'name' ], [ 'call', 'literal', 'literal', 'name', 'name' ]), "check equal")

    return {"Plagarised" : ((simBlocks.length/blocks1.length) * 100), "Line numbers": line_numbers}
}

function textualDiff(f1 : Code, f2: Code) : Array<Array<number>>{
    let similar = []

    let x = f1.getPlainCode()
    let y = f2.getPlainCode()
    for(let u = 0; u < x.length; u++) {
        for(let w = 0; w < y.length; w ++) {
            if( x[u].trim() == y[w].trim() ) {
                similar.push([u, u, w, w])
            }
        }
    }

    compressSimilarity(similar)

    return similar
}

function compressSimilarity(list: Array<Array<number>>)  {
    for(let i = 0; i < list.length; i++) {
        let y = []
        if(list[i + 1]) {
            if(list[i][1] == (list[i+1][0] - 1) && list[i][3] == (list[i+1][2] - 1)) {
                let ll = list[i+1][1]
                let fl = list[i + 1][3]
                list[i] = [list[i][0], ll, list[i][2], fl]
                y = list.splice(i + 1, 1)
                compressSimilarity(list)                }
        } 
    }
}

function sortList(list : Array<string>) {
    list.sort((a, b) =>
     a.localeCompare(b)); //using String.prototype.localCompare()
     return list
};


function checkCall(sn1 : SyntaxNode, sn2: SyntaxNode) {
    if (sn1.type == "call" && sn2.type == "call") {
        if(sn1.func.type == "name" && sn2.func.type == "name") {
            if(sn1.func.id == sn2.func.id) {
                if(sn1.args.length == sn2.args.length) {
                    let a_l = []
                    let b_l = []
                    for(let m = 0; m < sn1.args.length; m++) {
                        a_l.push(sn1.args[m].actual.type)
                        b_l.push(sn2.args[m].actual.type)
                    }
                    a_l = sortList(a_l)
                    b_l = sortList(b_l)
                    
                    if(arraysEqual(a_l, b_l)) {
                        return true
                    }

                }
            }
        }
    }
}

function checkAssign(sn1 : SyntaxNode, sn2: SyntaxNode) {
    let x = 0
    if(sn1.type == "assign" && sn2.type == "assign") {
        for(let q = 0; q < sn1.targets.length; q++) {
            if(sn1.targets && sn1.targets[q] && sn1.sources && sn1.sources[q] && sn2.targets && sn2.targets[q] && sn2.sources && sn2.sources[q]) {
                if((sn1.targets[q].type == sn2.targets[q].type) && (sn1.sources[q].type == sn2.sources[q].type)) {
                    x = x + 1
                }
            }
        }
        if (x >  0.6 * sn1.targets.length) {
            return true
        }
    }

}

function checkElse(sn1 : SyntaxNode, sn2: SyntaxNode) {
    if(sn1.type == "else" && sn2.type == "else") {
        if(sn1.code && sn1.code.length > 0 && sn2.code && sn2.code.length > 0) {
            if(sn1.code.length == sn2.code.length) {
                let x = 0
                for(let q = 0; q < sn1.code.length; q++) {
                    let w = sn1.code[q]
                    let e = sn2.code[q]
                    if(w.type == "return" && e.type == "return") {
                        if(w.values.length == e.values.length) {
                            x = x + 1
                        }
                    }
                    else if(w.type == "assign" && e.type == "assign") {
                        if(checkAssign(w, e)) {
                            x = x + 1
                        }
                    }
                }

                if(x > 0.6 * sn1.code.length) {
                    return true
                }
            }
        }

    }
}

function checkDef(sn1: SyntaxNode, sn2:SyntaxNode) {
    if(sn1.type == "def" && sn2.type == "def") {
        if(sn1.code && sn1.code.length > 0 && sn2.code && sn2.code.length > 0) {
            if(sn1.code.length == sn2.code.length) {
                let u = 0
                for(let q = 0; q < sn1.code.length; q++) {
                    let w = sn1.code[q]
                    let e = sn2.code[q]
                    if(w.type == "return" && e.type == "return") {
                        if(w.values.length == e.values.length) {
                            u = u + 1
                        }
                    }
                    else if(w.type == "assign" && e.type == "assign") {
                        if(checkAssign(w, e)) {
                            u = u + 1
                        }
                    }
                }

                if (u > 0.6 * sn1.code.length) {
                    return true
                }
            }
        }
    }
}

function arraysEqual(a1: Array<string>,a2 : Array<string>) {
    return JSON.stringify(a1)==JSON.stringify(a2);
}

function checkBlockIsThere(block : Block, list: Array<Array<Block>>) {
    for(let i = 0; i < list.length; i ++) {
        if(list[i].includes(block)) {
            return true
        }
    }
}