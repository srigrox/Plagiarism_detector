import IFile from "./IFile";
import Folder from "./Folder";
import Code from "./Code";
import SelectedFiles from "./SelectedFiles";

export function folderStructureCompare(selectedFiles: SelectedFiles) {
    let files = Array.from(selectedFiles.getSelectedFiles())

    let tree1: Array<[number, string]> = mapTree(0, files[0]);
    let tree2: Array<[number, string]> = mapTree(0, files[1]);

    console.log(tree1);
    console.log(tree2);

    //tree1.sort(sortFunc);
    //tree2.sort(sortFunc);

    return compare(tree1, tree2);
    
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

    function compare(tree1: Array<[number, string]>, tree2: Array<[number, string]>): Array<[string, string]> {
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
}