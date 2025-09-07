import { ElementMatcher } from "../ElementMatcher";
import { SyntacticElement } from "../SyntacticElement";

export class LineContent extends SyntacticElement {
    static keyword?: string;
    
    static match(matcher: ElementMatcher) {
        matcher.matchValue(this.keyword ?? "");

        return matcher.finish();
    }
};