import { Token, TokenType } from "../Tokenizer/Token";
import { create, yourtakingtoolong } from "../Utils/Utils";
import { Expression } from "./Expression";
import { Identifier } from "./TokenContainers/Identifier";
import { Keyword } from "./TokenContainers/Keyword";
import { SyntacticElement } from "./SyntacticElement";
import { Zingle } from "./Zingle";
import { Variable } from "./Variable";
import { Type } from "./Type";
import { ElementBuilder } from "./ElementBuilder";
import { ElementMatcher } from "./ElementMatcher";

export class Generic extends SyntacticElement {
    types: Type[] = [];

    static match(matcher: ElementMatcher) {
        matcher.matchValue("<");

        matcher.finishLazy();
        
        while(matcher.going) {
            yourtakingtoolong();
            
            console.log("i", matcher.tokens[matcher.i])

            if(matcher.matchTypeOptional(TokenType.Identifier)) {
                matcher.matchElementOptional(Generic);

                console.log("identifier")
                
                if(matcher.matchValueOptional(",")) {
                    console.log(",")
                    continue;
                }
            }
            
            if(matcher.matchValue(">")) {
                console.log(">")

                break;
            }

            matcher.invalidate();
        }
        
        return matcher.finish();
    }

    static read(self: Generic, builder: ElementBuilder) {
        builder.advancePastExpectedValue("<")

        while(builder.going) {
            yourtakingtoolong();

            if(builder.advancePastValue(">")) break;

            self.types.push(builder.readElement(Type));
            
            builder.advancePastValue(",");
        }

        return builder.finish();
    }
}