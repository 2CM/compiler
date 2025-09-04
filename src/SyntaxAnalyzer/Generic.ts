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

export class Generic extends SyntacticElement {
    types: Type[] = [];

    static match(tokens: Token[], i: number) {
        return tokens[i].value == "<";
    }

    read(builder: ElementBuilder) {
        builder.advancePastExpectedValue("<")

        while(builder.going) {
            yourtakingtoolong();

            if(builder.advancePastValue(">")) break;

            this.types.push(builder.readElement(Type));
            
            builder.advancePastValue(",");
        }

        return builder.finish();
    }
}