import Content from "./Content";
import IComparison from "./IComparison";
import TextualDiff from "./TextualDiff";

export default class ComparisonFactory {
    
    public makeComparison(comp: string): IComparison {
        if (comp === "content") {
            return new Content();
        } else if (comp === "textDiff") {
            return new TextualDiff();
        } else {
            return undefined;
        }
    }
}