import IFile from "./IFile";
import SelectedFiles from "./SelectedFiles";
import SummaryComparison from "./SummaryComparision";

export default class User {
    username : String;
    password : String;
    files : Array<IFile>;
    comparisons : Array<SummaryComparison>;
    selectedFiles : SelectedFiles;
}