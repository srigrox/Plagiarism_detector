import Code from "./Code";
import SelectedFiles from "./SelectedFiles";
import { Block, ControlFlowGraph, SyntaxNode, walk } from "@msrvida/python-program-analysis";

// function that does the main comparision algorithm for 2 selected files.
export function compareAlgorithm(selectedFiles: SelectedFiles) {

    let iterator = selectedFiles.getSelectedFiles().values()

    let file1 : Code = iterator.next().value
    let file2 : Code = iterator.next().value

    console.log("hey")
    console.log(compare(file1, file2), "result")

    return compare(file1, file2)
}

// function to create dictionary of textual difference in the code and content difference in the code.
export function compare(f1:Code, f2:Code) {
    return {"content_check" : compareFiles(f1, f2), "textual diff" : textualDiff(f1, f2)}
}

// function to create the content difference between 2 code files.
export function compareFiles(f1:Code, f2:Code) : {"Plagarised": number, "Line numbers": (string | number[])[][]} {

    //get parsed code from the files
    let c1 = f1.getCode() 
    let c2 = f2.getCode() 

    // create a control flow graph tree which contains blocks ordered in the order of execution
    let cfg1 = new ControlFlowGraph(c1)
    let cfg2 = new ControlFlowGraph(c2)

    // initialize the blocks of the control flow graphs.
    let blocks1 = cfg1.blocks
    let blocks2 = cfg2.blocks

    //initialize array for similar blocks.
    let simBlocks = []

    //initialize array of similar line numbers.
    let line_numbers = []

    //loops through the list of blocks to get similar blocks
    for (let i = 0; i < blocks1.length; i++) {
        for (let y = 0; y < blocks2.length; y++) {
            if(blocks1[i].statements && blocks2[y].statements) {
                let u = 0
                for(let z = 0; z < blocks1[i].statements.length; z++) {
                    for(let q = 0;  q < blocks2[y].statements.length; q++) {
                        if(blocks1[i].statements[z] && blocks2[y].statements[q]) {
                            if(blocks1[i].statements[z].type == blocks2[y].statements[q].type) {
                                let a = blocks1[i].statements[z]
                                let b = blocks2[y].statements[q] 
                                
                                let a_loc = [a.location.first_line - 1, a.location.last_line - 1]
                                let b_loc = [b.location.first_line - 1, b.location.last_line - 1]
    
                                //checks if the two syntax nodes a and b are similar
                                if(checkSyntax(a, b)) {
                                    u = u + 1
                                    line_numbers.push([a_loc, b_loc, a.type])
                                }
        
                            }
                        }
                    }
                }
                if(blocks1[i].statements.length > blocks2[y].statements.length) {
                    if(u > 0) {
                        if(checkBlockIsThere(blocks2[y], simBlocks)) {
                        }
                        else {
                            //push if block doesnt exist in list of similar blocks
                            simBlocks.push([blocks1[i], blocks2[y]])
                        break
                        }
                    }
                }
                else {
                    if(u > 0) {
                        if(checkBlockIsThere(blocks2[y], simBlocks)) {
                        }
                        else {
                            //push if block doesnt exist in list of similar blocks
                            simBlocks.push([blocks1[i], blocks2[y]])
                        break
                        }
                    }
                }
            }
        }
    }

    if(blocks1.length > blocks2.length) {
        return {"Plagarised" : ((simBlocks.length/blocks1.length) * 100), "Line numbers": line_numbers}
    }
    else {
        return {"Plagarised" : ((simBlocks.length/blocks2.length) * 100), "Line numbers": line_numbers}
    }
}

//function that gets the textual difference for 2 files
export function textualDiff(f1 : Code, f2: Code) : {"Plagarised": number, "Line numbers": number[][]}{
    let similar = []

    let z = 0

    //gets the raw code
    let x = f1.getPlainCode()
    let y = f2.getPlainCode()

    //loop through the list of lines to find similar lines
    for(let u = 0; u < x.length; u++) {
        for(let w = 0; w < y.length; w ++) {
            if( x[u].trim() == y[w].trim() ) {
                if(checkLineNumberIsThere(u, similar)) {}
                else {
                    similar.push([u, u, w, w])
                }
            }
        }
    }

    if(x.length > y.length) {
        z = ((similar.length/x.length) * 100)
    }
    else {
        z = ((similar.length/y.length) * 100)
    }

    compressSimilarity(similar)

    return {"Plagarised": z, "Line numbers": similar}
}

//helper function to compress a list of similar lines
export function compressSimilarity(list: Array<Array<number>>)  {
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

//helper function to sort a list
export function sortList(list : Array<string>) {
    list.sort((a, b) =>
     a.localeCompare(b));
     return list
};


//function to check for similar call calls in 2 syntax nodes
export function checkCall(sn1 : SyntaxNode, sn2: SyntaxNode) {
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

//function to check for similar assign calls in 2 syntax nodes
export function checkAssign(sn1 : SyntaxNode, sn2: SyntaxNode) {
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

//function to check for similar else calls in 2 syntax nodes
export function checkElse(sn1 : SyntaxNode, sn2: SyntaxNode) {
    if(sn1.type == "else" && sn2.type == "else") {
        if(sn1.code && sn1.code.length > 0 && sn2.code && sn2.code.length > 0) {
            if(sn1.code.length == sn2.code.length) {
                let x = 0
                for(let q = 0; q < sn1.code.length; q++) {
                    let w = sn1.code[q]
                    let e = sn2.code[q]
                    if(checkSyntax(w, e)) {
                        x = x + 1
                    }
                }

                if(x > 0.4 * sn1.code.length) {
                    return true
                }
            }
        }

    }
}

//function to check for similar def calls in 2 syntax nodes
export function checkDef(sn1: SyntaxNode, sn2:SyntaxNode) {
    if(sn1.type == "def" && sn2.type == "def") {
        if(sn1.code && sn1.code.length > 0 && sn2.code && sn2.code.length > 0) {
            if(sn1.code.length == sn2.code.length) {
                let u = 0
                let result : Array<SyntaxNode> = []
                for(let q = 0; q < sn1.code.length; q++) {
                    for(let n = 0; n < sn2.code.length; n++) {
                        let w = sn1.code[q]
                        let e = sn2.code[n]

                        if(checkSyntax(w, e)) {
                            if(result.includes(w)) {
                            }
                            else {
                                u = u + 1
                                result.push(w)
                            }
                        }
                    }
                }

                if (u > 0.4 * sn1.code.length) {
                    return true
                }
            }
        }
    }
}

//function to check for similar import calls in 2 syntax nodes
export function checkImport(sn1: SyntaxNode, sn2:SyntaxNode) {
    if(sn1.type == "import" && sn2.type == "import") {
        let x = 0
        if(sn1.names.length > sn2.names.length) {
            x = sn1.names.length
        }
        else {
            x = sn2.names.length
        }

        let u = 0

        for(let i = 0; i < sn1.names.length; i ++) {
            for(let y = 0; y < sn2.names.length; y ++) {
                if(sn1.names[i].path == sn2.names[y].path) {
                    u = u + 1
                }
            }
        }

        if(u > 0.6 * x) {
            return true
        }
    }

}

//function to check for similar for calls in 2 syntax nodes
export function checkFor(sn1: SyntaxNode, sn2:SyntaxNode) {
    if(sn1.type == "for" && sn2.type == "for") {
        if(sn1.target.length == sn2.target.length) {
            let result = true;
            for(let r = 0; r < sn1.target.length; r ++) {
                if(sn1.target[r].type == sn2.target[r].type) {
                    result = result && true
                }
                else {
                    result = result && false
                }
            }
            if(result) {
                let u = 0
                for(let x = 0; x < sn1.code.length; x++) {
                    for(let y = 0; y < sn2.code.length; y++) {
                        let w = sn1.code[x]
                        let e = sn2.code[y]
                        if(checkSyntax(w, e)) {
                            u = u + 1
                        }
                    }
                }
                
                let x = 0
                if(sn1.code.length > sn2.code.length) {
                    x = sn1.code.length
                }
                else {
                    x = sn2.code.length
                }

                if(u > 0.4 * x) {
                    return true
                }
            } 
        }
    }
}

//function to check for similar return calls in 2 syntax nodes
export function checkReturn(sn1: SyntaxNode, sn2:SyntaxNode) {
    if(sn1.type == "return" && sn2.type == "return") {
        if(sn1.values.length == sn2.values.length) {
            let u = 0
            for(let i = 0; i < sn1.values.length; i ++) {
                for(let y = 0; y < sn2.values.length; y ++) {
                    let w = sn1.values[i]
                    let e = sn2.values[y]
                    if(checkSyntax(w, e)) {
                        u = u + 1
                    }
                }
            }

            if(sn1.values.length > sn2.values.length) {
                if(u > 0.4 * sn1.values.length) {
                    return true
                }
            }
            else {
                if(u > 0.4 * sn2.values.length) {
                    return true
                }
            }

        }
    }
}

//function to check for similar assert calls in 2 syntax nodes
export function checkAssert(sn1: SyntaxNode, sn2:SyntaxNode) {
    if(sn1.type == "assert" && sn2.type == "assert") {
        if(sn1.cond && sn2.cond) {
            if(sn1.cond.type == sn2.cond.type) {
                let a = sn1.cond
                let b = sn2.cond
                if(checkSyntax(a,b)) {
                    return true
                }
            }
        }
        return true
    }
}

//function to check for similar class calls in 2 syntax nodes
export function checkClass(sn1: SyntaxNode, sn2:SyntaxNode) {
    console.log("my b")
    if(sn1.type == "class" && sn2.type == "class") {
        let u = 0
        if(sn1.code && sn2.code) {
            for(let x = 0; x < sn1.code.length; x++) {
                for(let y = 0; y < sn2.code.length; y++) {
                    let w = sn1.code[x]
                    let e = sn2.code[y]
                    if(checkSyntax(w, e)) {
                        u = u + 1
                    }
                }
            }
            if(sn2.code.length > sn1.code.length) {
                if(u > 0.4 * sn1.code.length) {
                    return true
                }
            }
            else {
                if(u > 0.4 * sn2.code.length) {
                    return true
                }
            }
        }
        return true
    }
}


// Function that checks the syntax of all types of Syntax node and is called in the main function "compareFiles"
export function checkSyntax(a: SyntaxNode, b:SyntaxNode) {

    //check for assign block
    if((a.type == "assign" && b.type == "assign")) {
        if(checkAssign(a, b)) {
            return true;
        }
    }

    //check for binop block
    else if(a.type == "binop" && b.type == "binop") {
        if(a.left.type == b.left.type && a.right.type == b.right.type) {
            if(a.right.type == "name" && b.right.type == "name") {
                if(a.right.id == b.right.id) {
                    return true;
                }
            }
            else if(a.right.type == "literal" && b.right.type == "literal") {
                if(a.right.value == b.right.value) {
                    return true;
                }
            }
            else if(a.left.type == "literal" && b.left.type == "literal") {
                if(a.left.value == b.left.value) {
                    return true;
                }
            }
        }

    }

    //check for literal block
    else if(a.type == "literal" && b.type == "literal") {
        if(a.value == b.value) {
            return true;
        }
    }


    //check for call block
    else if(a.type == "call" && b.type == "call") {
        if(checkCall(a, b)) {
            return true;     
        }

    }

    //check for def block
    else if(a.type == "def" && b.type == "def") {
        if(checkDef(a, b)) {
            return true;
        }
                                        
    }

    //check for else block
    else if(a.type == "else" && b.type == "else") {
        if(checkElse(a, b)) {
            return true;
        }

    }

    //check for import block
    else if(a.type == "import" && b.type == "import") {
        if(checkImport(a, b)) {
            return true;
        }
    }

    //check for for block
    else if(a.type == "for" && b.type == "for") {
        if(checkFor(a,b)) {
            return true;
        }
    }

    //check for return block
    else if(a.type == "return" && b.type == "return") {
        if(checkReturn(a, b)) {
            return true;
        }
    }

    //check for assert block
    else if(a.type == "assert" && b.type == "assert") {
        if(checkAssert(a, b)) {
            return true;
        }
    }

    // check for class block
    else if(a.type == "class" && b.type == "class") {
        if(checkClass(a, b)) {
            return true
        }
    }
}

//helper function for checking if 2 arrays are equal
export function arraysEqual(a1: Array<string>,a2 : Array<string>) {
    return JSON.stringify(a1)==JSON.stringify(a2);
}

//helper function for checking if a block is there in a list of blocks
export function checkBlockIsThere(block : Block, list: Array<Array<Block>>) {
    for(let i = 0; i < list.length; i ++) {
        if(list[i].includes(block)) {
            return true;
        }
    }
}

//helper function to check if a line number is there in a list of line numbers
export function checkLineNumberIsThere(line : number, list: number[][]) {
    for(let i = 0; i < list.length; i ++) {
        if(list[i].slice(0,2).includes(line)) {
            return true;
        }
    }
}