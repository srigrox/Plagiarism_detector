import IFile from "./IFile";
import SelectedFiles from "./SelectedFiles";
import SummaryComparison from "./SummaryComparison";

export default class User {
    username : string;
    password : string;
    files : Array<IFile>;
    comparisons : Array<SummaryComparison>;
    selectedFiles : SelectedFiles;

    getUsername(): string{
        return this.username;
    }
}