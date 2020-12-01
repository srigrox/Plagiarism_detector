import IFile from "./IFile";
import Folder from "./Folder";
import Code from "./Code";
import SelectedFiles from "./SelectedFiles";
import { ASSIGN, ControlFlowGraph, walk } from "@msrvida/python-program-analysis";


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
    compare(tree1, tree2)

    console.log(compare(tree1, tree2), "the result is:")

    return {"structure" :structureCompare(tree1, tree2), "content": compare(tree1, tree2)};
    
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

    function compare(tree1: Array<[number, string]>, tree2: Array<[number, string]>): Array<[string, string]> {
        let output: Array<[string, string]> = []
        let t1 = getCodeFiles(files[0])
        let t2 = getCodeFiles(files[1])
        for (let i = 0; i < t1.length; i++) {
            for (let y = 0; y < t2.length; y++) {
                if (compareFiles(t1[i], t2[y])["Plagarised"] > 0.5) {
                    output.push([t1[i].getName(), t2[y].getName()])
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

    function compareFiles(f1:Code, f2:Code) : {"Plagarised": Number} {
        let c1 = f1.getCode() 
        let c2 = f2.getCode()

        let n1 = walk(c1).map(node => node.type)
        let n2 = walk(c2).map(node => node.type)

        let cfg1 = new ControlFlowGraph(c1)
        let cfg2 = new ControlFlowGraph(c2)


        let blocks1 = cfg1.blocks

        let blocks2 = cfg2.blocks

        let simBlocks = []

        console.log("hey")


        for (let i = 0; i < blocks1.length; i++) {
            for (let y = 0; y < blocks2.length; y++) {
                console.log(blocks1.length, "came here 3")
                if(blocks1[i].statements && blocks1[i].statements) {
                    for(let z = 0; z < blocks1[i].statements.length; z++) {
                        if(blocks1[i].statements[z] && blocks2[y].statements[z]) {
                            if(blocks1[i].statements[z].type === blocks2[y].statements[z].type) {
                                console.log(blocks1[i].statements.length, "came here 2")
                                let a = blocks1[i].statements[z]
                                let b = blocks2[y].statements[z]
                                if(a.type == "assign" && b.type == "assign") {
                                    console.log(a.targets.length, "something")
                                    for(let q = 0; q < a.targets.length; q++) {
                                        if(a.targets && a.targets[q] && b.targets && b.targets[q]) {
                                            if(a.targets[q].type == b.targets[q].type) {
                                                simBlocks.push([blocks1[i], blocks2[y]])
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

        console.log(simBlocks, "similar")
        // if(blocks1.length / simBlocks.length > 0.5) {
        return {"Plagarised" : ((blocks1.length / simBlocks.length) * 100)}
        // }
        // console.log(f1, "file")
        // console.log(c2.code[0])
    }

}