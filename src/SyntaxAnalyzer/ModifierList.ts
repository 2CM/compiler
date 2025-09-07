import { Token, TokenType } from "../Tokenizer/Token";
import { yourtakingtoolong } from "../Utils/Utils";
import { ElementBuilder } from "./ElementBuilder";
import { ElementMatcher } from "./ElementMatcher";
import { SyntacticElement } from "./SyntacticElement";
import { Keyword } from "./TokenContainers/Keyword";

export class ModifierList extends SyntacticElement {
    body: Keyword[] = []

    static match(matcher: ElementMatcher) {
        matcher.matchValue(...Keyword.modifierKeywords);

        return matcher.finish();
    }

    static read(self: ModifierList, builder: ElementBuilder) {
        while(builder.going) {
            yourtakingtoolong();

            if(!builder.checkValue(...Keyword.modifierKeywords)) break;

            self.body.push(builder.readElement(Keyword));
        }

        return builder.finish();
    }
}