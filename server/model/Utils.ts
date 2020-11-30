import IFile from "./IFile";
import Folder from "./Folder";
import Code from "./Code";
import SelectedFiles from "./SelectedFiles";
import { ControlFlowGraph } from "@msrvida/python-program-analysis";

export function folderStructureCompare(selectedFiles: SelectedFiles) {
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

    return structureCompare(tree1, tree2);
    
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
                compareFiles(t1[i], t2[y]) 
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

    function compareFiles(f1:Code, f2:Code) {
        let c1 = f1.getCode() 
        let c2 = f2.getCode()

        let cfg1 = new ControlFlowGraph(c1)
        let cfg2 = new ControlFlowGraph(c2)

        console.log(cfg1, "cfg1")

        let blocks1 = cfg1.blocks
        let blocks2 = cfg2.blocks

        // for (let i = 0; i < blocks1.length; i++) {
        //     for (let y = 0; y < blocks2.length; y++) {
        //         if(blocks1[i].type === blocks2[y].type) {
        //             if(blocks1[i].targets.length)
        //         }
        //     }
        // }
        // console.log(f1, "file")
        // console.log(c2.code[0])
    }

}