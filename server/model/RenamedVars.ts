import { rename } from "fs";
import IComparison from "./IComparison";

class RenamedVars implements IComparison {
    comparedFiles: any;
    starred: boolean;
    ignored: boolean;
    summary: string;

    PlagiarismSeverity(): number {
        throw new Error("Method not implemented.");
    }

    flipStar(): void {
        throw new Error("Method not implemented.");
    }
    
    flipIgnored(): void {
        throw new Error("Method not implemented.");
    }

}

export default RenamedVars;