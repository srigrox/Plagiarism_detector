import IFile from "./IFile";
import Folder from "./Folder";
import Code from "./Code";
import SelectedFiles from "./SelectedFiles";
import { Block, ControlFlowGraph, SyntaxNode, walk } from "@msrvida/python-program-analysis";


export function folderStructureCompare(selectedFiles: SelectedFiles) {
    // const ASSIGN: "assign"
    let files = Array.from(selectedFiles.getSelectedFiles())

    let tree1: Array<[number, string]> = mapTree(0, files[0]);
    let tree2: Array<[number, string]> = mapTree(0, files[1]);

    console.log(files, "files")

    console.log(tree1, "tree1");
    console.log(tree2, "tree2");

    // let t1 = getCodeFiles(files[0])
    // let t2 = getCodeFiles(files[1])

    // console.log(t1, "t1");
    // console.log(t2, "t2");

    //tree1.sort(sortFunc);
    //tree2.sort(sortFunc);
    // compare(tree1, tree2)

    console.log(compareFolders(tree1, tree2).content[0][2], "the result is:")

    function compareFolders(t1 : Array<[number, string]>, t2 : Array<[number, string]>) {
        return {"structure" :structureCompare(t1, t2), "content": compare(t1, t2)};
    }

    return compareFolders(tree1, tree2)
    
    function mapTree(startNum: number, file: IFile): Array<[number, string]> {
        let output: Array<[number, string]> = [ [startNum, file.getName()] ]
        if (file instanceof Code === true) {
            // If it's a Code, no need to do any more.
        } else if (file instanceof Folder === true) {
            // If it's a folder, map the tree of each subfile.
            file.getSubFiles().forEach(e => {
                output = output.concat(mapTree(startNum + 1, e));
            });
        }
        
        return output;
    }

    function sortFunc(e1: [number, string], e2: [number, string]) {
        if (e1[0] != e2[0]) {
            return e1[0] - e2[0];
        } else {
            return e1[1].toLowerCase().localeCompare(e2[1].toLowerCase());
        }
    }

    function structureCompare(tree1: Array<[number, string]>, tree2: Array<[number, string]>): Array<[string, string]> {
        let output: Array<[string, string]> = []
        for (let i = 0; i < tree1.length || i < tree2.length; i++) {
            if (i < tree1.length && i < tree2.length) {
                if (tree1[i][0] !== tree2[i][0] || tree1[i][1] !== tree2[i][1]) {
                    output.push([tree1[i][1], tree2[i][1]]);
                }
            } else if (i < tree1.length) {
                output.push([tree1[i][1], 'null']);
            } else {
                output.push(["null", tree2[i][1]]);
            }
        }

        return output;
    }

    function compare(tree1: Array<[number, string]>, tree2: Array<[number, string]>): Array<[string, string, number[][][]]> {
        let output: Array<[string, string, number[][][]]> = []
        let t1 = getCodeFiles(files[0])
        let t2 = getCodeFiles(files[1])
        for (let i = 0; i < t1.length; i++) {
            for (let y = 0; y < t2.length; y++) {
                if (compareFiles(t1[i], t2[y])["Plagarised"] > 0.5) {
                    output.push([t1[i].getName(), t2[y].getName(), compareFiles(t1[i], t2[y])["Line numbers"]])
                } 
            }
        }

        return output;
    }

    function getCodeFiles(file: IFile) : Array<Code>{
        let result : Array<Code> = [];
        if(file instanceof Code) {
            result.push(file)
        }
        else if(file instanceof Folder){
            let subfiles = file.getSubFiles()
            for(let i = 0; i < subfiles.length; i ++) {
                result = result.concat(getCodeFiles(subfiles[i]))
            }
        }
        return result
    }

    function compareFiles(f1:Code, f2:Code) : {"Plagarised": Number, "Line numbers": number[][][]} {
        let c1 = f1.getCode() 
        let c2 = f2.getCode()

        let n1 = walk(c1).map(node => node.type)
        let n2 = walk(c2).map(node => node.type)

        let cfg1 = new ControlFlowGraph(c1)
        // console.log(cfg1, "cfg1")

        let cfg2 = new ControlFlowGraph(c2)
        // console.log(cfg2, "cfg2")


        let blocks1 = cfg1.blocks

        let blocks2 = cfg2.blocks

        let simBlocks = []

        let line_numbers = []

        // let typeList = ["module", "import" , "from" , "decorator" , "decorate" , "def" , "parameter" , "assign" , "assert" , "pass" , "return" , "yield" , "raise" , "continue" , "break" , "global" , "nonlocal" , "class"]
        let typeList = ["assign"]
        // console.log("hey")


        for (let i = 0; i < blocks1.length; i++) {
            for (let y = 0; y < blocks2.length; y++) {
                // console.log(blocks1, "blocks 1 test")
                if(blocks1[i].statements && blocks1[i].statements) {
                    for(let z = 0; z < blocks1[i].statements.length; z++) {
                        if(blocks1[i].statements[z] && blocks2[y].statements[z]) {
                            if(blocks1[i].statements[z].type === blocks2[y].statements[z].type) {
                                // console.log()
                                let a = blocks1[i].statements[z]
                                let b = blocks2[y].statements[z]
                                // console.log(a, "a is")

                                if((a.type == "assign" && b.type == "assign")) {
                                    let a_loc = [a.location.first_line, a.location.last_line]
                                    let b_loc = [b.location.first_line, b.location.last_line]
                                    // console.log(a, "typeof a")
                                    if(checkAssign(a, b)) {
                                        simBlocks.push([blocks1[i], blocks2[y]])
                                        line_numbers.push([a_loc, b_loc])
                                    }
                                }

                                if(a.type == "binop" && b.type == "binop") {
                                    let a_loc = [a.location.first_line, a.location.last_line]
                                    let b_loc = [b.location.first_line, b.location.last_line]
                                    if(a.left.type == b.left.type && a.right.type == b.right.type) {
                                        if(a.right.type == "name" && b.right.type == "name") {
                                            if(a.right.id == b.right.id) {
                                                simBlocks.push([blocks1[i], blocks2[y]])
                                                line_numbers.push([a_loc, b_loc])
                                            }
                                        }
                                        else if(a.right.type == "literal" && b.right.type == "literal") {
                                            if(a.right.value == b.right.value) {
                                                simBlocks.push([blocks1[i], blocks2[y]])
                                                line_numbers.push([a_loc, b_loc])
                                            }
                                        }
                                        else if(a.left.type == "literal" && b.left.type == "literal") {
                                            if(a.left.value == b.left.value) {
                                                simBlocks.push([blocks1[i], blocks2[y]])
                                                line_numbers.push([a_loc, b_loc])
                                            }
                                        }
                                    }
        
                                }

                                if(a.type == "literal" && b.type == "literal") {
                                    let a_loc = [a.location.first_line, a.location.last_line]
                                    let b_loc = [b.location.first_line, b.location.last_line]
                                    if(a.value == b.value) {
                                        simBlocks.push([blocks1[i], blocks2[y]])
                                        line_numbers.push([a_loc, b_loc])
                                    }
                                }
        

                                if(a.type == "call" && b.type == "call") {
                                    let a_loc = [a.location.first_line, a.location.last_line]
                                    let b_loc = [b.location.first_line, b.location.last_line]
                                    // console.log(a.args, "args")
                                    if(checkCall(a, b)) {
                                        simBlocks.push([blocks1[i], blocks2[y]])
                                        line_numbers.push([a_loc, b_loc])
                                    }
        
                                }

                                if(a.type == "def" && b.type == "def") {
                                    let a_loc = [a.location.first_line, a.location.last_line]
                                    let b_loc = [b.location.first_line, b.location.last_line]
                                    if(a.code && a.code.length > 0 && b.code && b.code.length > 0) {
                                        if(a.code.length == b.code.length) {
                                            for(let q = 0; q < a.code.length; q++) {
                                                let w = a.code[q]
                                                let e = b.code[q]
                                                if(w.type == "return" && e.type == "return") {
                                                    if(w.values.length == e.values.length) {
                                                        simBlocks.push([blocks1[i], blocks2[y]])
                                                        line_numbers.push([a_loc, b_loc])
                                                    }
                                                }
                                                else if(w.type == "assign" && e.type == "assign") {
                                                    if(checkAssign(w, e)) {
                                                        simBlocks.push([blocks1[i], blocks2[y]])
                                                        line_numbers.push([a_loc, b_loc])
                                                    }
                                                }
                                            }
                                        }
                                    }
                                                                    
                                }

                                if(a.type == "else" && b.type == "else") {
                                    let a_loc = [a.location.first_line, a.location.last_line]
                                    let b_loc = [b.location.first_line, b.location.last_line]
                                    let x = 0
                                    if(a.code && a.code.length > 0 && b.code && b.code.length > 0) {
                                        if(a.code.length == b.code.length) {
                                            for(let q = 0; q < a.code.length; q++) {
                                                let w = a.code[q]
                                                let e = b.code[q]
                                                if(w.type == "return" && e.type == "return") {
                                                    if(w.values.length == e.values.length) {
                                                        simBlocks.push([blocks1[i], blocks2[y]])
                                                        line_numbers.push([a_loc, b_loc])
                                                    }
                                                }
                                                else if(w.type == "assign" && e.type == "assign") {
                                                    if(checkAssign(w, e)) {
                                                        simBlocks.push([blocks1[i], blocks2[y]])
                                                        line_numbers.push([a_loc, b_loc])
                                                    }
                                                }
                                            }
                                        }
                                    }
        
                                }
        
                            }
                        }
                    }
                }
            }
        }

        // console.log(simBlocks, "simblocks")

        // console.log(simBlocks, "similar")
        // if(blocks1.length / simBlocks.length > 0.5) {
        return {"Plagarised" : ((blocks1.length / simBlocks.length) * 100), "Line numbers": line_numbers}
        // }
        // console.log(f1, "file")
        // console.log(c2.code[0])
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
                        if(a_l == b_l) {
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
                        // return true
                        x = x + 1
                    }
                }
            }
            if (x >  0.6 * sn1.targets.length) {
                return true
            }
        }

    }

    // function checkCode(sn1: SyntaxNode, sn2:SyntaxNode) {
    //     let x = 0
    //     if(sn1.type == "else")
    //     if(sn1.code && sn1.code.length > 0 && sn2.code && sn2.code.length > 0) {
    //         if(sn1.code.length == sn2.code.length) {
    //             for(let q = 0; q < sn1.code.length; q++) {
    //                 let w = sn1.code[q]
    //                 let e = sn2.code[q]
    //                 if(w.type == "return" && e.type == "return") {
    //                     if(w.values.length == e.values.length) {
    //                         simBlocks.push([blocks1[i], blocks2[y]])
    //                     }
    //                 }
    //                 else if(w.type == "assign" && e.type == "assign") {
    //                     if(checkAssign(w, e)) {
    //                         simBlocks.push([blocks1[i], blocks2[y]])
    //                     }
    //                 }
    //             }
    //         }
    //         // if(a.code[0].type == "return") {
    //         //     console.log(a.code[0].values, "values")
    //         // }
    //     }
    // }

}