import Abstraction from "./Abstraction";
import RenamedVars from "./RenamedVars";
import TextualDiff from "./TextualDiff";

class ComparisonFactory {
    public makeRenamedVars(): RenamedVars {
        return new RenamedVars();
    }

    public makeTextualDiff(): TextualDiff {
        return new TextualDiff();
    }

    public makeAbstraction(): Abstraction {
        return new Abstraction();
    }
}

export default ComparisonFactory;