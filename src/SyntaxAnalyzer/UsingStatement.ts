import { yourtakingtoolong } from "../Utils/Utils";
import { ElementBuilder } from "./ElementBuilder";
import { ElementMatcher } from "./ElementMatcher";
import { SyntacticElement } from "./SyntacticElement";
import { Identifier } from "./TokenContainers/Identifier";

export class UsingStatement extends SyntacticElement {
    identifiers: Identifier[] = [];

    static match(matcher: ElementMatcher): boolean {
        matcher.matchValue("using");
        
        return matcher.finish();
    }
    
    static read(self: UsingStatement, builder: ElementBuilder) {
        builder.advancePastExpectedValue("using");

        while(builder.going) {
            yourtakingtoolong();

            self.identifiers.push(builder.readElement(Identifier));

            if(!builder.advancePastValue(".")) break;
        }

        builder.advancePastExpectedValue(";");
        
        return builder.finish();
    }
}