import { IL } from "../IL/IL";
import { ICreatesIlThing } from "../IntermediateCodeGenerator/ICreatesIlThing";
import { Token, TokenType } from "../Tokenizer/Token";
import { yourtakingtoolong } from "../Utils/Utils";
import { ElementBuilder } from "./ElementBuilder";
import { ElementMatcher } from "./ElementMatcher";
import { SyntacticElement } from "./SyntacticElement";
import { Keyword } from "./TokenContainers/Keyword";

export class ModifierList extends SyntacticElement implements ICreatesIlThing<IL.Attribute[]> {
    body: Keyword[] = []

    static match(matcher: ElementMatcher) {
        matcher.matchValue(...Keyword.modifierKeywords);

        matcher.finishLazy();

        while(matcher.matchValueOptional(...Keyword.modifierKeywords)) {
            continue;
        }

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

    createIlThing() {
        return this.body.map(keyword => IL.Attribute[keyword.value as keyof typeof IL.Attribute])
    }
}